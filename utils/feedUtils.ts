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
