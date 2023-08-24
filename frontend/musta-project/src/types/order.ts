type OrderStatus = 'Progress' | 'End' | 'Cancled';


interface OrderResponse {
  orderApiId : string;
  articleApiId : string;
  articleTitle : string;
  consumerName : string;
  sellerName : string;
  date : string;
  orderStatus: OrderStatus;
}
interface OrderResponse {
  orderApiId : string;
  articleApiId : string;
  sellerName : string;
  consumerName : string;
  date : string;
  articleTitle: string;
  orderStatus: OrderStatus;
}

interface OrderResponseDto {
  content: OrderResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
  };
}

interface OrderConsumerFilter {
  orderStatus : string; //주문 상태
  text : string; //게시글의 제목, 구매자의 이름
  sortOrder : string;
  userType : string;
  page : number;
  limit : number; 
}