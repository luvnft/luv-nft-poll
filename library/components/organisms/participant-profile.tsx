"use client";

import { Address } from "viem";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { ellipsisAddress, getInitials, isValidUrl } from "@/utils";

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
  allocation: bigint;
}

type Step = "allocation" | "registration" | "distribution";

interface ParticipantProfileProps {
  data: Participant;
  isAdmin?: boolean;
  step?: Step;
  onStatusChange?: (address: Address, status: Participant["status"]) => void;
  onAllocationChange?: (address: Address, allocation: string) => void;
  status?: Participant["status"];
  allocation?: string;
}

const ParticipantProfile = ({
  data,
  isAdmin = false,
  step,
  onStatusChange,
  onAllocationChange,
  status: controlledStatus,
  allocation: controlledAllocation,
}: ParticipantProfileProps) => {
  const status = controlledStatus ?? data.status;
  const allocation =
    controlledAllocation ??
    (data.allocation ? data.allocation.toString() : "0");

  const renderStepContent = () => {
    if (!isAdmin && !step) {
      return (
        <span className="px-2 py-1 text-sm rounded bg-gray-100">{status}</span>
      );
    }

    switch (step) {
      case "registration":
        return isAdmin ? (
          <Select
            value={status}
            onValueChange={(newStatus) =>
              onStatusChange?.(data.address, newStatus as Participant["status"])
            }
          >
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
        ) : (
          <span className="px-2 py-1 text-sm rounded bg-gray-100">
            {status}
          </span>
        );

      case "allocation":
        return isAdmin ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={allocation}
              onChange={(e) =>
                onAllocationChange?.(data.address, e.target.value)
              }
              className="w-[140px]"
              placeholder="Allocation"
            />
          </div>
        ) : (
          <span className="px-2 py-1 text-sm rounded bg-gray-100">
            {allocation}
          </span>
        );

      case "distribution":
        return (
          <span className="px-2 py-1 text-sm rounded bg-gray-100">
            {data.allocation?.toString() || "0"}
          </span>
        );

      default:
        return (
          <span className="px-2 py-1 text-sm rounded bg-gray-100">
            {status}
          </span>
        );
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
          {renderStepContent()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParticipantProfile;
export type { Participant };
