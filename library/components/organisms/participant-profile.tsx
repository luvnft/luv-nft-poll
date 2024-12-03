"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Address } from "viem";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { ellipsisAddress, getInitials } from "@/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { isValidUrl } from "@/utils";
import useCapyProtocol from "@/hooks/use-capy-protocol";

interface Participant {
  address: Address;
  strategyAddress: Address;
  name: string;
  bio: string;
  avatar: string;
  status:
    | "None"
    | "Pending"
    | "Accepted"
    | "Rejected"
    | "Appealed"
    | "InReview"
    | "Canceled";
}

interface ParticipantProfileProps {
  data: Participant;
  isAdmin?: boolean;
}

const ParticipantProfile = ({
  data,
  isAdmin = false,
}: ParticipantProfileProps) => {
  const [status, setStatus] = useState(data.status);
  const [isSaving, setIsSaving] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const { updateRecipientStatus } = useCapyProtocol();

  const handleStatusChange = (newStatus: Participant["status"]) => {
    setStatus(newStatus);
    setShowSave(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const statusMap = {
        None: 0,
        Pending: 1,
        Accepted: 2,
        Rejected: 3,
        Appealed: 4,
        InReview: 5,
        Canceled: 6,
      };

      await updateRecipientStatus({
        status: statusMap[status],
        strategyAddress: data.strategyAddress,
        recipientId: data.address,
      });

      toast.success("Status updated successfully");
      setShowSave(false);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(
        `Application failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Avatar>
            <AvatarImage
              src={
                isValidUrl(data.avatar) ||
                `https://avatar.vercel.sh/${data.address}`
              }
              alt={`${data.name} logo`}
            />
            <AvatarFallback>{getInitials(data.name)}</AvatarFallback>
          </Avatar>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.name}</div>
        <p className="text-xs text-muted-foreground font-semibold">
          {ellipsisAddress(data.address, 10)}
        </p>
        <p className="text-sm text-muted-foreground">{data.bio}</p>
        <div className="flex items-center gap-2 mt-2">
          {isAdmin ? (
            <>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None" disabled>
                    None
                  </SelectItem>
                  <SelectItem value="Pending" disabled>
                    Pending
                  </SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Appealed" disabled>
                    Appealed
                  </SelectItem>
                  <SelectItem value="InReview" disabled>
                    In Review
                  </SelectItem>
                  <SelectItem value="Canceled" disabled>
                    Canceled
                  </SelectItem>
                </SelectContent>
              </Select>

              {showSave && (
                <Button onClick={handleSave} disabled={isSaving} size="sm">
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              )}
            </>
          ) : (
            <span className="px-2 py-1 text-sm rounded bg-gray-100">
              {status}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParticipantProfile;
export type { Participant };
