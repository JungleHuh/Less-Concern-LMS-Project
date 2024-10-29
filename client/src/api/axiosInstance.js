import axios from 'axios';
//axios.create()를 사용하여 axiosInstance라는 객체를 만듭니다.
// 이 객체는 baseURL로 http://localhost:5000을 설정하여, 
// 이 인스턴스를 사용한 모든 요청이 해당 URL을 기준으로 처리
const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
  });
  
  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = JSON.parse(sessionStorage.getItem("accessToken")) || "";
  
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
  
      return config;
    },
    (err) => Promise.reject(err)
  );
  
  export default axiosInstance;