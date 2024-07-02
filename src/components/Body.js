import RestaurantCard,{withPromotedLabel} from "./RestaurantCard";
import resList from "../utils/mockData";
import { useState,useEffect,useContext } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";
import UserContext from "../utils/UserContext";

const Body=()=>{

    const [listOfRestaurants,setlistofRestaurants]=useState([]);
    const [filteredRestaurant,setFilteredRestaurant]=useState([]);

    const [searchText,setSearchText]=useState("");

    
    const RestaurantCardPromoted=withPromotedLabel(RestaurantCard);
    
    useEffect(()=>{
      fetchData();
    },[]);

    const fetchData=async()=>{
        const data= await fetch("https://www.swiggy.com/dapi/restaurants/list/v5?lat=23.2582415&lng=77.3952417&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING");
    
        const json=await data.json();
        //console.log(json);
        setlistofRestaurants(json.data.cards[4].card.card.gridElements.infoWithStyle.restaurants);
        
        setFilteredRestaurant(json.data.cards[4].card.card.gridElements.infoWithStyle.restaurants);
    };

    const onlineStatus=useOnlineStatus();
    if(onlineStatus==false) return <h1>Looks like you are offline! Please check your internet status.</h1>;
     

    const {setUserName ,loggedInUser}=useContext(UserContext);

    return listOfRestaurants==0 ? <Shimmer /> :(
        <div className="body">
<div className="filter flex">
    <div className="search m-4 p-4">
        <input type="text" className="border border-solid border-black" value={searchText} onChange={(e)=>{
            setSearchText(e.target.value);
        }} />
        <button className="px-4 py-2 bg-green-100 m-4 rounded-lg" onClick={()=>{
       
        const filteredRes=listOfRestaurants.filter((res)=>res.info.name.toLowerCase().includes(searchText.toLowerCase()));
        
        //setlistofRestaurants(filteredRes);
        setFilteredRestaurant(filteredRes);


        }}>Search</button>
    </div >
    <div className="search m-4 p-4 flex items-center">
        <button className="px-4 py-2 bg-gray-100 rounded-lg" onClick={()=>{
         const filteredList =listOfRestaurants.filter((res)=>res.info.avgRatingString>4);
         setFilteredRestaurant(filteredList);
    }}
    >Top Rated Restaurants</button>
    </div>
    
    <div className="m-7 p-4">
    <label>UserName: </label>
    <input className="border border-black p-2" value={loggedInUser} onChange={(e)=>setUserName(e.target.value)}></input>
    </div>
    
</div>
<div className="flex flex-wrap">
    {filteredRestaurant.map((restaurant)=>(
        <Link key={restaurant.info.id} to={"/restaurants/"+restaurant.info.id}>
            
            {restaurant.info.promoted ? <RestaurantCardPromoted resData={restaurant}/>:<RestaurantCard  resData={restaurant} />}
            </Link>
    ))}
</div>
</div>
    )
};

export default Body;
