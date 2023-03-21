import * as React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  CreatPost,
  CustomButton,
  Friends,
  Friendship,
  Photos,
  PostList,
  PostSkeleton,
  ProfileCover,
  ProfileMenu,
  ProfilePhoto,
} from "../../components";
import classes from "../../components/Profile/ProfileCover/cover.module.css";
import style from "./profile.module.css";
import IconStyle from "../../styles/icons.module.css";
import { selectAllPosts, useFetchPostsByUserQuery, useFetchPostsQuery } from "../../app/features/post/postApi";
import { useFetchPhotosQuery } from "../../app/features/user/photosApi";
import { useFetchUserProfileQuery } from "../../app/features/user/userProfileApi";
import Skeleton from "react-loading-skeleton";

function Profile() {
  const [showProfilePhoto, setShowProfilePhoto] = React.useState(false);
  const { user } = useSelector((state) => state.user);
  const { username } = useParams();
  const photoRef = React.useRef(null);
  const navigate = useNavigate();
  const usernameID = username ? username : user?.username;
  const isVisitor = !(usernameID === user?.username);
  const {
    data,
    isLoading: Profileloading,
    isFetching: ProfileIsFetching,
    isError: ProfileIsError,
  } = useFetchUserProfileQuery(usernameID);
  const userdata = data?.data?.user;
  const userfriendsdata = data?.data?.friends;
  const userfriendshipdata = data?.data?.friendship;
  const userdataSkelton = Profileloading || ProfileIsFetching;

  // const {
  //   data: friends = [],
  //   isLoading: friendsloading,
  //   isFetching: friendsIsFetching,
  // } = useFetchFriendsQuery();

  //photosData
  const {
    data: photosData = [],
    isLoading: photosloading,
    isFetching: photosIsFetching,
    isSuccess: photosIsSuccess,
    isError: photosIsError,
  } = useFetchPhotosQuery(usernameID);
  const photosSkelton = photosloading || photosIsFetching;

  // postsData
  const {
    data: posts = [],
    isLoading: postsLoading,
    isFetching: postsIsFetching,
    isSuccess: postsIsSuccess,
    isError: postsIsError,
    error,
  } = useFetchPostsByUserQuery(usernameID)

  const { data: profileUserPosts } = useFetchPostsQuery()
  const { ids, entities } = profileUserPosts
  let filteredIds;
  filteredIds = ids?.filter(
    (p) => entities[p].owner?._id === user?._id
  );
  const profilePostsData = isVisitor ? posts?.ids : filteredIds
  const postsSkelton = postsLoading || postsIsFetching;
  const postsSkeltonHide = postsIsSuccess && !postsLoading && !error;

  React.useEffect(() => {
    if (ProfileIsError || photosIsError || postsIsError) {
      navigate("/404");
    }
  }, [ProfileIsError, postsIsError, photosIsError]);

  return (
    <div className={style.profile_container}>
      <div className={style.head}>
        <div className={style.head_container}>
          <div className={style.top_head}>
            {userdataSkelton ? (
              <Skeleton className={classes.coverContainer} />
            ) : (
              <ProfileCover
                isVisitor={isVisitor}
                user={userdata}
                photosData={photosData?.data}
              />
            )}
            <div className={style.top_head_content}>
              <div className={style.photo_container}>
                <div className={style.photo}>
                  {userdataSkelton ? (
                    <Skeleton
                      width="160px"
                      height="160px"
                      circle
                      containerClassName="avatar-skeleton"
                    />
                  ) : (
                    <img
                      src={userdata?.photo}
                      className={style.user_photo}
                      alt={userdata?.firstName}
                      ref={photoRef}
                    />
                  )}
                  {!isVisitor && (
                    <>
                      <div
                        className={`${style.add_photo} small_circle hover1`}
                        onClick={() => setShowProfilePhoto((perv) => !perv)}
                      >
                        <i className={IconStyle.camera_filled_icon}></i>
                      </div>
                      {showProfilePhoto && (
                        <ProfilePhoto
                          photoRef={photoRef}
                          setShowProfilePhoto={setShowProfilePhoto}
                          showProfilePhoto={showProfilePhoto}
                          photosData={photosData?.data}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className={style.profile_info}>
                <h2 className={style.user_name}>
                  {`${userdata?.firstName} ${userdata?.lastName}`}
                  <i
                    style={{ marginLeft: "10px" }}
                    className={IconStyle.confirmed_icon}
                  />
                </h2>
                <span
                  className={style.friends}
                >{`${userfriendsdata?.length} friends`}</span>
              </div>
              {!isVisitor && (
                <div className={style.profile_btns}>
                  <CustomButton
                    className={`blue_btn btns`}
                    value="Add to story"
                  />
                  <CustomButton
                    className={`gray_btn btns`}
                    value="Edit profile"
                  />
                </div>
              )}
              {isVisitor && (
                <Friendship
                  userId={userdata?._id}
                  userfriendshipdata={userfriendshipdata}
                  usernameID={usernameID}
                />
              )}
            </div>
          </div>
          <div className={style.line}></div>

          <ProfileMenu />
        </div>
      </div>
      <div className={style.footer}>
        <div className={style.footer_container}>
          <div className={style.details}>
            <div
              className={style.details_con}
              style={{
                top: "65px",
              }}
            >
              <Photos
                photosData={photosData?.data}
                photosSkelton={photosSkelton}
              />
              <Friends
                userfriendsdata={userfriendsdata}
                photosSkelton={photosSkelton}
              />
            </div>
          </div>
          <div className={style.posts}>
            {!isVisitor && <CreatPost user={userdata} />}
            {postsSkelton && <PostSkeleton />}
            {postsSkeltonHide && <PostList posts={profilePostsData} isVisitor={isVisitor} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;