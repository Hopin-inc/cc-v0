import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ActivityFormState } from "./types";

type CreateActivityDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: ActivityFormState;
  onFormChange: (changes: Partial<ActivityFormState>) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export const CreateActivityDialog = ({
  isOpen,
  onOpenChange,
  form,
  onFormChange,
  onSubmit,
  isLoading,
}: CreateActivityDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>活動を作成する</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>活動を作成する</DialogTitle>
          <DialogDescription>新しい活動を追加します。</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              タイトル
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => onFormChange({ title: e.target.value })}
              placeholder="活動のタイトルを入力"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              内容
            </Label>
            <Textarea
              id="content"
              value={form.content}
              onChange={(e) => onFormChange({ content: e.target.value })}
              placeholder="活動の内容を入力"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "作成中..." : "作成"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
