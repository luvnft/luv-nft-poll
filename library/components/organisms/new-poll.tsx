import { useState } from "react";
import { useForm } from "react-hook-form";
import { useXionProtocol } from "@/library/hooks/use-xion-protocol";
import { useAccount } from "@burnt-labs/abstraxion";
import { Dialog, DialogContent, DialogTrigger } from "@/library/components/atoms/dialog";
import { Button } from "@/library/components/atoms/button";
import { Input } from "@/library/components/atoms/input";
import { Label } from "@/library/components/atoms/label";
import { Loader } from "lucide-react";

interface FormData {
  question: string;
  avatar: string;
  description: string;
  duration: number;
  yesTokenName: string;
  yesTokenSymbol: string;
  noTokenName: string;
  noTokenSymbol: string;
}

const NewPoll = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { createPoll } = useXionProtocol();
  const { data: account } = useAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!account?.bech32Address) return;

    try {
      setIsLoading(true);
      await createPoll({
        question: data.question,
        avatar: data.avatar,
        description: data.description,
        duration: data.duration,
        yesTokenName: data.yesTokenName,
        yesTokenSymbol: data.yesTokenSymbol,
        noTokenName: data.noTokenName,
        noTokenSymbol: data.noTokenSymbol,
      });
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating poll:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="font-medium px-8 py-4 rounded-3xl text-xl flex items-center gap-4 bg-[#33CB82] hover:bg-[#33CB82]/80 transition-colors duration-200"
        >
          Create Poll
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              {...register("question", { required: "Question is required" })}
              placeholder="What do you want to predict?"
            />
            {errors.question && (
              <p className="text-red-500 text-sm">{errors.question.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              {...register("avatar")}
              placeholder="https://example.com/avatar.png"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register("description", {
                required: "Description is required",
              })}
              placeholder="Describe your prediction market"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="duration">Duration (in seconds)</Label>
            <Input
              id="duration"
              type="number"
              {...register("duration", {
                required: "Duration is required",
                min: {
                  value: 60,
                  message: "Duration must be at least 60 seconds",
                },
                max: {
                  value: 2592000,
                  message: "Duration must be at most 30 days",
                },
              })}
              placeholder="Duration in seconds"
            />
            {errors.duration && (
              <p className="text-red-500 text-sm">{errors.duration.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="yesTokenName">YES Token Name</Label>
              <Input
                id="yesTokenName"
                {...register("yesTokenName", {
                  required: "YES token name is required",
                })}
                placeholder="YES Token Name"
              />
              {errors.yesTokenName && (
                <p className="text-red-500 text-sm">
                  {errors.yesTokenName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="yesTokenSymbol">YES Token Symbol</Label>
              <Input
                id="yesTokenSymbol"
                {...register("yesTokenSymbol", {
                  required: "YES token symbol is required",
                })}
                placeholder="YES"
              />
              {errors.yesTokenSymbol && (
                <p className="text-red-500 text-sm">
                  {errors.yesTokenSymbol.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="noTokenName">NO Token Name</Label>
              <Input
                id="noTokenName"
                {...register("noTokenName", {
                  required: "NO token name is required",
                })}
                placeholder="NO Token Name"
              />
              {errors.noTokenName && (
                <p className="text-red-500 text-sm">{errors.noTokenName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="noTokenSymbol">NO Token Symbol</Label>
              <Input
                id="noTokenSymbol"
                {...register("noTokenSymbol", {
                  required: "NO token symbol is required",
                })}
                placeholder="NO"
              />
              {errors.noTokenSymbol && (
                <p className="text-red-500 text-sm">
                  {errors.noTokenSymbol.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#33CB82] hover:bg-[#33CB82]/80"
          >
            {isLoading ? (
              <Loader className="animate-spin mr-2" size={16} />
            ) : null}
            Create Poll
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewPoll;
