import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export async function OverviewCardsGroup() {
  const { total, emotion, products, users } = await getOverviewData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:gap-7.5">
      <OverviewCard
        label="Total Score"
        data={{
          ...total,
          value: compactFormat(total.value),
        }}
        // Icon={icons.Views}
      />

      <OverviewCard
        label="Emotion Score"
        data={{
          ...emotion,
          value: compactFormat(emotion.value),
        }}
        // Icon={icons.emotion}
      />

      <OverviewCard
        label="Attention Score"
        data={{
          ...products,
          value: compactFormat(products.value),
        }}
        // Icon={icons.Product}
      />

      {/* <OverviewCard
        label="ChatScore"
        data={{
          ...users,
          value: compactFormat(users.value),
        }}
        // Icon={icons.Users}
      /> */}
    </div>
  );
}
