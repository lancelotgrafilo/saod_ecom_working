import CategoryList from "@/components/frontend/CategoryList";
import CommunityTrainings from "@/components/frontend/CommunityTrainings";
import Hero from "@/components/frontend/Hero";
import MarketList from "@/components/frontend/MarketList";
import { getData } from "@/lib/getData";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function Home() {
  const categoriesResponse = await getData("categories");

  // Extract the array from the response if necessary
  const categoriesArray = Array.isArray(categoriesResponse)
    ? categoriesResponse // Direct array
    : categoriesResponse?.data || []; // Extract array from { data: [] }

  // Filter categories with more than 3 products
  const categories = categoriesArray.filter(
    (category) =>
      Array.isArray(category.products) && category.products.length > 3
  );

  const trainingsData = await getData("trainings");
  const trainings = Array.isArray(trainingsData) ? trainingsData : [];

  const session = await getServerSession(authOptions);

  console.log(session?.user);

  return (
    <div className="min-h-screen">
      <Hero />
      <MarketList />

      {categories.map((category, i) => (
        <div className="py-8" key={i}>
          <CategoryList isMarketPage={false} category={category} />
        </div>
      ))}

      <CommunityTrainings
        title="Featured Trainings"
        trainings={trainings.slice(0, 3)}
      />
    </div>
  );
}