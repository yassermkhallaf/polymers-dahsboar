import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCountryCode } from "@/lib/utils";
import ReactCountryFlag from "react-country-flag";
import { Button } from "./ui/button";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import CountryCategoryPieChart from "./country-category-pie-chart";
import { useRef } from "react";
const CountryCard = ({
  activeCountry,
  cardHeight,
  countryCategoryData,
  countryCustomerData,
  onBack,
}) => {
  const countryCode = getCountryCode(activeCountry);
  const cardHeaderRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  console.log("countryCustomerData", countryCategoryData);
  const selectedCountryData = countryCategoryData.filter(
    (country) => country.country === activeCountry
  )[0].categories;
  console.log("selectedCountryData", selectedCountryData);
  return (
    <Card style={{ height: cardHeight }}>
      <CardHeader ref={cardHeaderRef}>
        <CardTitle className="flex items-center gap-2 flex-col">
          <div className="self-start">
            <Button onClick={onBack} variant="outline">
              <ArrowBigLeft />
            </Button>
          </div>
          <div className="flex items-center gap-2 ">
            {countryCode ? (
              <ReactCountryFlag
                countryCode={countryCode}
                svg
                style={{
                  width: "5em",
                  height: "3.75em",
                  boxShadow: isDark
                    ? "0 0 10px rgba(255, 255, 255, 0.2)"
                    : "0 0 10px rgba(0, 0, 0, 0.2)",
                }}
              />
            ) : (
              <div className="w-6 h-4 bg-gray-200 rounded-sm" />
            )}

            <div className="text-2xl font-semibold font-montserrat-alternates">
              {activeCountry}
            </div>
          </div>
        </CardTitle>
        <Separator className="mb-2 w-full h-[1px] " orientation="horizontal" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 overflow-hidden">
        <ScrollArea className="h-[400px] p-2 flex flex-col ">
          <p className="text-lg font-semibold font-montserrat-alternates">
            Customers
          </p>
          <ScrollArea className="h-[200px] p-2 flex flex-col ">
            <>
              {countryCustomerData[0].customers
                .sort((a, b) => b.qty - a.qty)
                .map((customer) => {
                  return (
                    <div
                      key={customer.customer}
                      className="flex items-center justify-between gap-2 px-2 py-1 hover:bg-gray-200/50 transition-colors duration-300"
                    >
                      <p className="truncate  max-w-[200px]">
                        {customer.customer}
                      </p>
                      <p className="font-roboto-mono text-right  min-w-[60px] ">
                        {(customer.qty / 1000).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
            </>
          </ScrollArea>
          <Separator />
          <div className="h-[400px]">
            <CountryCategoryPieChart
              countryCategoryData={selectedCountryData}
            />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
export default CountryCard;
