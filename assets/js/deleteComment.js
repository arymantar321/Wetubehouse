import axios from "axios";

const commentNumber = document.getElementById("jsCommentNumber");

const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

function removeComment(event) {
  const targetBtn = event.target;
  const targetClass = targetBtn.className;
  const commentListId = targetBtn.parentNode.parentNode.id;
  try {
    if (`${targetClass}` === "deleteButton") {
      document.getElementById(commentListId).remove();
      decreaseNumber();
    } else {
      console.log(error);
      console.log("else에러");
    }
  } catch (error) {
    console.log(error);
    console.log("catch에러");
  }
}

const removeCommentAxios = async (event) => {
  const videoId = window.location.href.split("/videos/")[1];
  const targetBtn = event.target;
  const comment = targetBtn.parentNode.parentNode.id;
  const response = await axios({
    url: `/api/${videoId}/remove`,
    method: "POST",
    data: { comment },
  });
  if (response.status === 200) {
    removeComment(event);
  }
};

document
  .querySelector(".video__comments-list")
  .addEventListener("click", removeCommentAxios);
