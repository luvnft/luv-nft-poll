import React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/atoms/card";
import { Separator } from "@/components/atoms/separator";

const RecentActions = ({ actions }: { actions: any[] }) => ( // TODO:
  <Card className="col-span-3">
    <CardHeader>
      <CardTitle>Recent Actions</CardTitle>
      <CardDescription>You took 265 actions this month.</CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {actions.map((item, index, array) => (
          <React.Fragment key={index}>
            <li className="flex justify-between">
              <span>{item.action}</span>
              <span className="text-sm text-gray-500">{item.date}</span>
            </li>
            {index < array.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default RecentActions;
