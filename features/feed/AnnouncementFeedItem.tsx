import { FeedItem } from "@/types";

type AnnouncementFeedItemProps = {
  item: FeedItem;
}

export function AnnouncementFeedItem({ item }: AnnouncementFeedItemProps) {
  return (
    <div>
      <div className="flex items-start gap-2 mb-4">
        <div className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-medium">
          お知らせ
        </div>
      </div>
      <p className="text-sm mb-4 text-foreground">{item.content}</p>
      {/* {item.link && (
        <div className="mb-4">
          <RichLink {...item.link} />
        </div>
      )}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{item.date}</p>
        <div className="flex items-center">
          <Avatar className="w-8 h-8 mr-3">
            <AvatarImage src={item.avatar} alt={item.user} />
            <AvatarFallback>{item.user?.[0]}</AvatarFallback>
          </Avatar>
          <p className="text-sm text-muted-foreground">{item.user}</p>
        </div>
      </div> */}
    </div>
  );
}
