import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios"; // Import axios
import { useNavigate } from "react-router-dom";

const Budgets = () => {
  const navgiate = useNavigate();
  const [responseData, setResponseData] = useState({});
  useEffect(() => {
    const token = Cookies.get("token");

    axios({
      method: "get",
      url: "http://localhost:3000/home",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        // Handle the response
        setResponseData(response.data);
        console.log("Response:", response.data);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error:", error);
        navgiate("/");
      });
  }, []); // Empty dependency array to ensure this effect runs only once

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <a className="flex items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Spend Sense
            </span>
          </a>
          <div className="flex items-center">
            <a className="mr-6 text-sm  text-gray-500 dark:text-white hover:underline">
              {responseData.email}
            </a>
            <a
              href="/logout"
              className="text-sm  text-blue-600 dark:text-blue-500 hover:underline">
              Logout
            </a>
          </div>
        </div>
      </nav>
      <main className="p-10 h-auto pt-20">
        <div className="text-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col justify-center items-center rounded-lg h-32 md:h-64 bg-neutral-100 drop-shadow-lg">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Total Income
            </span>
            <br />
            <h1 className=" text-2xl font-semibold text-green-400">$100.30</h1>
          </div>
          <div className="flex flex-col justify-center items-center  rounded-lg  h-32 md:h-64 bg-neutral-100 drop-shadow-lg">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Total Expenses
            </span>
            <br />
            <h1 className=" text-2xl font-semibold text-red-400">$0.30</h1>
          </div>
          <div className="flex flex-col justify-center items-center  rounded-lg bg-neutral-100 drop-shadow-lg h-32 md:h-64">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Total Profit
            </span>
            <br />
            <h1 className=" text-2xl font-semibold text-green-400">$100</h1>
          </div>
        </div>
        <div className=" rounded-lg bg-neutral-100 drop-shadow-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Transaction name
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  Rent
                </th>
                <td className="px-6 py-4">Income</td>
                <td className="px-6 py-4">$1000.00</td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default Budgets;
