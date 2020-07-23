import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";

// Home

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

// Search

export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

// Upload

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location },
  } = req;
  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: req.user.id,
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

// Video Detail

export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate("comments");
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (error) {
    res.redirect(routes.home);
  }
};

// Edit Video

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator != req.user.id) {
      // 왼쪽은 오브젝트, 오른쪽은 스트링.
      // 다만, 둘다 따옴표 없는 스트링이라서, 같게 만드려면 둘 다에게 JSON.stringify를 적용해서 둘 다 따옴표 붙은 스트링으로 만들거나
      // 오른쪽, 혹은 둘 다에게 JSON.parse를 적용해서 둘 다 Object로 만들어야 하는데...parse는 왜인지 잘 적용이 안된다...명령이 반쯤 무시됨...
      // 같게 만드는 또 하나의 방법은 데이터 타입을 신경쓰지 않게 하기 위해서, !== 를 != 로 바꾸는 것이다.
      // 이번에는 후자의 방법을 적용.
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

// Delete Video

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator != req.user.id) {
      // 여기서도 getEditVideo 에 있었던 것과 같은 문제발생. 같은 문서의 위쪽, 해당 이름의 함수 내에 있는 주석을 참조.
      throw Error();
    } else {
      await Video.findOneAndRemove({ _id: id });
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

// Register Video View

export const postRegisterView = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

// Add Comment

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user,
  } = req;
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
    });
    video.comments.push(newComment.id);
    video.save();
    console.log(res);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

// delete Comment

export const postRemoveComment = async (req, res) => {
  const {
    body: { comment },
  } = req;
  try {
    const commentconst = await Comment.findById(comment);
    const commentconstid = await commentconst._id;
    if (commentconst.creator != req.user.id) {
      throw Error();
    } else {
      await Comment.findOneAndRemove({ _id: commentconstid });
    }
  } catch (error) {
    console.log("catch에러");
  } finally {
    res.end();
  }
};
