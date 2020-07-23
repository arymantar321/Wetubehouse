import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = async (comment) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  commentList.prepend(li);
  li.appendChild(span);

  span.innerHTML = comment;
  li.classList.add("commentList");
  // li.id = `${comment.id}`; // <- 지금 이것만 제대로 작동 안 함...
  // comment.id를 불러올 수 없는듯 당연히 못 불러오겠지 여기서 comment는 내가 입력한 내용인데...
  // 지정된 comment.id... 숫자랑 영어랑 섞인 이상한 걸 불러오려면 뭘 해야하지...? 임포트?
  span.classList.add("commentSpan");

  // button

  const button = document.createElement("button");
  span.appendChild(button);
  button.classList.add("deleteButton");
  button.innerHTML = "❌";

  // increase view number
  increaseNumber();
  //location.reload(true); // <-이건 그거다...페이지 전체 새로고침
  setTimeout(testF, 5000);
};

const testF = async () => {
  const videoId = window.location.href.split("/videos/")[1];
  await axios({
    url: `/videos/${videoId}`,
    method: "GET",
  });
  await axiox({ url: `/static/styles.css` });
  await axiox({ url: `/static/main.js` });
};

const sendComment = async (comment) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment,
    },
  });
  if (response.status === 200) {
    addComment(comment);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}
