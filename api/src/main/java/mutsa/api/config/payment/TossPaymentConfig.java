package mutsa.api.config.payment;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class TossPaymentConfig {
    @Value("${payment.toss.test_client_api_key}")
    private String testClientApiKey;
    @Value("${payment.toss.test_secret_api_key}")
    private String testSecretKey;
    @Value("${payment.toss.success_url}")
    private String successUrl;
    @Value("${payment.toss.fail_url}")
    private String failUrl;
    @Value("${payment.toss.mid}")
    private String mid;     // 가맹점 ID. 고유 식별자 (사업자 등록 필요)

    public static final String URL = "https://api.tosspayments.com/v1/payments/";
}
