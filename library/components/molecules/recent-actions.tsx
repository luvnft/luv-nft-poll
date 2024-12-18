import React from "react";
import Image from "next/image";

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
      {/* <CardDescription>You took 265 actions this month.</CardDescription> */}
    </CardHeader>
    <CardContent>
      {/* <ul className="space-y-3">
        {actions.map((item, index, array) => (
          <React.Fragment key={index}>
            <li className="flex justify-between">
              <span>{item.action}</span>
              <span className="text-sm text-gray-500">{item.date}</span>
            </li>
            {index < array.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </ul> */}
         <div className="flex flex-col items-center justify-center">
            <Image alt="recent action" src="/action.svg" width={150} height={150} />
            <h2 className="text-sm text-center sm:text-xl text-gray-600 mt-4">
            Activities will show up here 
            </h2>
          </div>
    </CardContent>
  </Card>
);

export default RecentActions;
