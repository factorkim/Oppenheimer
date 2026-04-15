const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// [경로 설정] server.js와 같은 폴더에 있는 comments.json을 가리킴
const DATA_PATH = path.join(__dirname, 'comments.json');

app.use(express.static(__dirname)); 

// 미들웨어 설정
app.use(cors()); // 프론트엔드와 백엔드 포트가 다를 때 발생하는 보안 문제 해결
app.use(express.json()); // JSON 데이터 파싱

let comments = [];
if (fs.existsSync(DATA_PATH)){
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf8');
        comments = JSON.parse(data);
    } catch (e) {
        console.error("데이터 로드 에러:", e);
        comments = []; // 파일이 없으면 빈 배열로 시작
    }
}


// [GET] 댓글 목록 가져오기
app.get('/api/comments', (req, res) => {
    res.json(comments);
});

// [POST] 새 댓글 등록하기
app.post('/api/comments', (req, res) => {
    const { name, content, date } = req.body;
    
    if (!name || !content) {
        return res.status(400).json({ message: "내용을 모두 입력해주세요." });
    }

    const newComment = { name, content, date };
    comments.unshift(newComment); // 최신 댓글이 위로 오도록 추가

    // [핵심] JSON 파일로 물리적 저장 (__dirname 경로 사용)
    try {
        fs.writeFileSync(DATA_PATH, JSON.stringify(comments, null, 2), 'utf8');
        res.status(201).json(newComment);
    } catch (err) {
        console.error("파일 저장 에러:", err);
        res.status(500).json({ message: "서버 저장 실패" });
    }
});

const HOST = '0.0.0.0'; // 모든 IP로부터의 접속 허용
app.listen(PORT, HOST, () => {
    console.log(`서버가 활성화되었습니다!`);
    console.log(`1. 내 컴퓨터 접속: http://localhost:${PORT}`);
    console.log(`2. 다른 기기 접속: http://[내_IPv4_주소]:${PORT}`);
});