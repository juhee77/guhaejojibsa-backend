package mutsa.api.config.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.http.Cookie;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;

public class JwtUtil {

    public static final String REFRESH_TOKEN = "refresh-token";
    private static final String AUTHORITIES = "authorities";

    public static String createToken(String requestUrl, String subject,
                                     String tokenExpire, Algorithm algorithm, Collection<String> authorities) {

        return JWT.create()
                .withSubject(subject)
                .withIssuer(requestUrl)
                .withExpiresAt(
                        new Date(System.currentTimeMillis() + Integer.parseInt(tokenExpire)))
                .withClaim("authorities",
                        new ArrayList<>(authorities))
                .sign(algorithm);
    }

    public static String createToken(String requestUrl, String subject,
                                     String tokenExpire, Algorithm algorithm) {

        return JWT.create()
                .withSubject(subject)
                .withIssuer(requestUrl)
                .withExpiresAt(
                        new Date(System.currentTimeMillis() + Integer.parseInt(tokenExpire)))
                .sign(algorithm);
    }

    /**
     * 1. 토큰이 정상적인지 검증(위조, 만료 여부) 2. Access Token인지 Refresh Token인지 구분
     *
     * @param algorithm
     * @param token
     * @return
     * @throws JWTVerificationException
     */
    public static JWTInfo decodeToken(Algorithm algorithm, String token)
            throws JWTVerificationException {
        JWTVerifier verifier = JWT.require(algorithm).build();

        DecodedJWT decodedJWT = verifier.verify(token);
        String username = decodedJWT.getSubject();

        String[] authoritiesJWT = decodedJWT.getClaim("authorities")
                .asArray(String.class);

        if (authoritiesJWT != null) {
            Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
            Arrays.stream(authoritiesJWT).forEach(authority -> {
                authorities.add(new SimpleGrantedAuthority(authority));
            });
        }

        return JWTInfo.builder()
                .username(username)
                .authorities(authoritiesJWT)
                .build();
    }

    public static boolean isCookieNameRefreshToken(Cookie cookie) {
        return JwtUtil.REFRESH_TOKEN.equals(cookie.getName());
    }

    @Getter
    @Builder
    public static class JWTInfo {

        private final String username;
        private final String[] authorities;
    }
}
