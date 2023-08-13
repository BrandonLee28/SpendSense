import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios"; // Import axios
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navgiate = useNavigate();
  const [budgetName, setBudgetName] = useState("");
  const [responseData, setResponseData] = useState({});
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);

  const handleBudgetAdd = () => {
    const token = Cookies.get("token");
    axios.post("http://localhost:3000/budget", {
      name: budgetName,
    });
    toggleBudgetModal();
    window.location.reload(false);
  };

  const generateBudgetModal = () => {
    return (
      <form className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
        <div
          tabIndex="-1"
          aria-hidden="true"
          className="flex items-center justify-center h-full">
          <div className="relative w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add Budget
                </h3>
                <button
                  onClick={toggleBudgetModal}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-6 space-y-6 flex flex-col justify-start mx-auto">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Budget Name
                  </label>
                  <input
                    onChange={(e) => setBudgetName(e.target.value)}
                    value={budgetName}
                    type="text"
                    id="name"
                    className="shadow-sm bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder=""
                    required
                  />
                </div>
              </div>

              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  onClick={() => handleBudgetAdd()}
                  data-modal-hide="AddTransaction"
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Add
                </button>
                <button
                  onClick={toggleBudgetModal}
                  data-modal-hide="AddTransaction"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  };

  const toggleBudgetModal = () => {
    setBudgetModalVisible(!budgetModalVisible);
  };

  const generateBudgetDivs = () => {
    if (!responseData.budgets) {
      return null;
    }

    return responseData.budgets.map((budgetItem) => (
      <a
        href={`/budgets/${budgetItem.id}`}
        key={budgetItem.id}
        className="flex flex-col justify-center items-center rounded-lg h-32 md:h-64 bg-neutral-100 drop-shadow-lg">
        <span
          href
          className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          {budgetItem.name}
        </span>
      </a>
    ));
  };

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
      <main className="justify-between mx-auto h-auto pt-20 max-w-screen-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {generateBudgetDivs()}
          <button
            onClick={() => toggleBudgetModal()}
            data-modal-target="defaultModal"
            data-modal-toggle="defaultModal"
            className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 h-32 md:h-64">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Add Budget
            </span>
            <br></br>
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 18">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 1v16M1 9h16"
              />
            </svg>
          </button>
        </div>
      </main>
      {budgetModalVisible && generateBudgetModal()}
    </>
  );
};

export default Home;
