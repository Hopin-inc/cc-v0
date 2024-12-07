import { FeedItem, Comment } from "@/types";

export const handleReaction = (itemId: number) => {
  console.log(`Reacted to item ${itemId}`);
};

export const handleParticipationRequest = (
  itemId: number,
  participationStatus: { [key: number]: boolean },
  setParticipationStatus: React.Dispatch<
    React.SetStateAction<{ [key: number]: boolean }>
  >
) => {
  setParticipationStatus((prevStatus) => ({
    ...prevStatus,
    [itemId]: !prevStatus[itemId],
  }));
};

export const toggleComments = (
  itemId: number,
  commentsVisible: { [key: number]: boolean },
  setCommentsVisible: React.Dispatch<
    React.SetStateAction<{ [key: number]: boolean }>
  >
) => {
  setCommentsVisible((prev) => ({
    ...prev,
    [itemId]: !prev[itemId],
  }));
};

export const handleAddComment = (
  itemId: number,
  newComment: string,
  comments: { [key: number]: Comment[] },
  setComments: React.Dispatch<
    React.SetStateAction<{ [key: number]: Comment[] }>
  >,
  setNewComments: React.Dispatch<
    React.SetStateAction<{ [key: number]: string }>
  >
) => {
  if (newComment.trim()) {
    const comment: Comment = {
      id: (comments[itemId]?.length || 0) + 1,
      user: {
        name: "山田",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      content: newComment.trim(),
    };
    setComments((prev) => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), comment],
    }));
    setNewComments((prev) => ({
      ...prev,
      [itemId]: "",
    }));
  }
};
