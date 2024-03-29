const userDatabase = require("../database");
const jwt = require("jsonwebtoken");

const login = (req, res, next) => {
  const { email, password } = req.body;

  const userInfo = userDatabase.filter((item) => {
    return item.email === email;
  })[0];

  if (!userInfo) {
    res.status(403).json("Not Authorized");
  } else {
    try {
      // access Token 발급
      const accessToken = jwt.sign(
        {
          id: userInfo.id,
          username: userInfo.username,
          email: userInfo.email,
        },
        process.env.ACCESS_SECRET,
        {
          expiresIn: "1m",
          issuer: "About Tech",
        }
      );

      // refresh Token 발급
      const refreshToken = jwt.sign(
        {
          id: userInfo.id,
          username: userInfo.username,
          email: userInfo.email,
        },
        process.env.REFRESH_SECRET,
        {
          expiresIn: "24h",
          issuer: "About Tech",
        }
      );

      // token 전송
      res.cookie("accessToken", accessToken, {
        // https, http의 차이를 명시
        secure: false,
        // 자바스클비ㅌ와 http중에 어디서 접근이 가능할지 정해주는 옵션
        // true로 하면 자바스크립트로 접근 불가
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true,
      });

      res.status(200).json("login success");
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

const accesstoken = (req, res) => {};

const refreshtoken = (req, res) => {};

const loginSuccess = (req, res) => {};

const logout = (req, res) => {};

module.exports = { login, accesstoken, refreshtoken, loginSuccess, logout };
