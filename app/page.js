'use client'

import { useContext, useEffect} from "react";
import request from "@/utils/hooks/request";
import { JsonContext } from "@/context/jsonContext";
import HomeSearch from "@/components/search/HomeSearch";

export default function Home() {

  const { silverMode } = useContext(JsonContext);

  useEffect(() => {
    request(`${process.env.NEXT_PUBLIC_DATA_API}/catalog/top/${silverMode ? 'silver' : 'gold'}`)
      .then((data) => {
        // setProductResponse(data);
      })
  }, [silverMode])


  return (
    <div className="home_page">
       <div className="custom_container">
        <div className="mt-[50px] flex items-center justify-center">
          <HomeSearch />
        </div>
      </div>
    </div>
  );
}
