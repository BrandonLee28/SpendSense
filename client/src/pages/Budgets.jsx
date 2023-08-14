import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios"; // Import axios
import { useNavigate, useParams } from "react-router-dom";

const Budgets = () => {
  const { budgetId } = useParams();
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [transactionName, setTransactionName] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [transactionSelector, setTransactionSelector] = useState("");
  const [BudgetEditModal, setBudgetEditModal] = useState(false);
  const [editBudgetName, setEditBudgetName] = useState("");

  const deleteTransaction = async (id) => {
    const targetTransaction = responseData.budget.transactions.find(
      (transaction) => transaction.id === transactionSelector
    );
    const token = Cookies.get("token");
    await axios({
      method: "delete",
      url: `http://localhost:3000/budget/${budgetId}/transaction/${transactionSelector}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toggleEditModal();
    window.location.reload(false);
  };

  const handleAddTransaction = () => {
    const token = Cookies.get("token");
    const transactionData = {
      name: transactionName,
      category: transactionCategory,
      amount: transactionAmount,
    };
    console.log(transactionData);
    axios({
      method: "post",
      url: `http://localhost:3000/budget/${budgetId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: transactionData,
    })
      .then((response) => {
        toggleTransactionModal();
        window.location.reload(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        navigate("/home");
      });
  };

  const generateBudgetEditModal = () => {
    const token = Cookies.get("token");

    return (
      <form
        id="AddTransaction"
        className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
        <div
          tabIndex="-1"
          aria-hidden="true"
          className="flex items-center justify-center h-full">
          <div className="relative w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Budget
                </h3>
                <button
                  onClick={toggleEditBudgetModal}
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
                    onChange={(e) => setEditBudgetName(e.target.value)}
                    placeholder={responseData.budget.budget.name}
                    type="text"
                    id="name"
                    className="shadow-sm bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    required
                    value={editBudgetName}
                  />
                </div>
              </div>

              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  data-modal-hide="AddTransaction"
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Edit
                </button>
                <button
                  onClick={async () => {
                    try {
                      await axios.delete(
                        `http://localhost:3000/budget/${budgetId}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                      toggleEditBudgetModal();
                      navigate("/home");
                    } catch (error) {
                      console.error(
                        "An error occurred while deleting the budget:",
                        error
                      );
                    }
                  }}
                  data-modal-hide="AddTransaction"
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  };

  const generateEditModal = (id) => {
    const targetTransaction = responseData.budget.transactions.find(
      (transaction) => transaction.id === transactionSelector
    );
    const token = Cookies.get("token");
    setTransactionAmount(targetTransaction.amount)
    setTransactionCategory(targetTransaction.category)
    setTransactionName(targetTransaction.name)
    return (
      <form
        id="AddTransaction"
        className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
        <div
          tabIndex="-1"
          aria-hidden="true"
          className="flex items-center justify-center h-full">
          <div className="relative w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Transaction
                </h3>
                <button
                  onClick={toggleEditModal}
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
                    Transaction Name
                  </label>
                  <input
                    onChange={(e) => setTransactionName(e.target.value)}
                    value={transactionName}
                    type="text"
                    id="name"
                    className="shadow-sm bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    required
                  />
                </div>
                <div className="mb-6">
                  <button
                    id="dropdownDefaultButton"
                    data-dropdown-toggle="dropdown"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3.5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    type="button">
                    {transactionCategory || 'Category'}
                    <svg
                      className="w-2.5 h-2.5 ml-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>

                  <div
                    id="dropdown"
                    className={`z-10 ${
                      dropdownVisible ? "" : "hidden"
                    } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownDefaultButton">
                      <li>
                        <a
                          onClick={() => {
                            setTransactionCategory("Income");
                            toggleTransactionDropdown();
                          }}
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                          Income
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={() => {
                            setTransactionCategory("Expenses");
                            toggleTransactionDropdown();
                          }}
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                          Expenses
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Transaction Amount
                    </label>
                    <input
                      onChange={(e) => setTransactionAmount(e.target.value)}
                      value={transactionAmount}
                      type="text"
                      id="name"
                      className="shadow-sm w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  onClick={async () => {
                    try {
                      await axios.patch(
                        `/budget/${budgetId}/transaction/${transactionSelector}`,
                        {
                          name: transactionName, // Update with the new name
                          category: transactionCategory, // Update with the new category
                          amount: transactionAmount, // Update with the new amount
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      toggleEditBudgetModal();
                      navigate(`/budgets/${budgetId}`)
                    } catch (error) {
                      console.error("Error editing transaction:", error);
                    }
                  }}
                  data-modal-hide="AddTransaction"
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Edit
                </button>
                <button
                  onClick={() => deleteTransaction(0)}
                  data-modal-hide="AddTransaction"
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  };

  const toggleTransactionDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleTransactionModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleEditModal = (id) => {
    setEditModalVisible(!editModalVisible);
    setTransactionSelector(id);
  };

  const toggleEditBudgetModal = () => {
    setBudgetEditModal(!BudgetEditModal);
  };
  // ... (generateTransactionDivs function and other code) ...
  const Profit = () => {
    if (totalProfit > 0) {
      return (
        <h1 className="text-2xl font-semibold text-green-400">
          +${totalProfit}
        </h1>
      );
    } else if (totalProfit < 0) {
      return (
        <h1 className="text-2xl font-semibold text-red-400">
          -${Math.abs(totalProfit)}
        </h1>
      );
    } else {
      return (
        <h1 className="text-2xl font-semibold text-neutral-400">
          ${totalProfit}
        </h1>
      );
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");

    axios({
      method: "get",
      url: `http://localhost:3000/budget/${budgetId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setResponseData(response.data);
        if (response.data.budget && response.data.budget.transactions) {
          calculateTotalIncome(response.data.budget.transactions);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        navigate("/");
      });
  }, [budgetId]);

  const calculateTotalIncome = (transactions) => {
    if (!transactions) {
      return;
    }

    let income = 0;
    let expenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.category === "Income") {
        income += parseInt(transaction.amount, 10);
      } else {
        expenses += parseInt(transaction.amount, 10);
      }
    });

    setTotalIncome(income);
    setTotalExpenses(expenses);
    setTotalProfit(income - expenses);
  };

  const generateTransactionDivs = () => {
    if (!responseData.budget || !responseData.budget.transactions) {
      return null;
    }

    const transactions = responseData.budget.transactions;

    return transactions.map((TransactionItem) => (
      <tr
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
        key={TransactionItem.id}>
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {TransactionItem.name}
        </th>
        <td className="px-6 py-4">{TransactionItem.category}</td>
        <td className="px-6 py-4">{TransactionItem.amount}</td>
        <td className="px-6 py-4">
          <button
            onClick={() => toggleEditModal(TransactionItem.id)}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Edit
          </button>
        </td>
      </tr>
    ));
  };

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
            <a
              href="/home"
              className="mr-6 text-sm text-blue-600 dark:text-white hover:underline">
              Home
            </a>
            <a className="mr-6 text-sm text-gray-500 dark:text-white hover:underline">
              {responseData.email}
            </a>
            <a
              href="/logout"
              className="text-sm text-blue-600 dark:text-blue-500 hover:underline">
              Logout
            </a>
            {/* Add the Home button here */}
          </div>
        </div>
      </nav>
      {responseData.budget ? (
        <h1 className=" text-center text-2xl font-semibold rounded-lg whitespace-nowrap dark:text-white">
          <p>{responseData.budget.budget.name}</p>{" "}
          <button
            onClick={() => toggleEditBudgetModal()}
            type="button"
            class="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Edit
          </button>
        </h1>
      ) : (
        console.log("Loading")
      )}

      <main className="p-10 h-auto pt-10 max-w-screen-xl flex-wrap justify-between items-center mx-auto">
        <div className="text-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col justify-center items-center rounded-lg h-32 md:h-64 bg-neutral-100 drop-shadow-lg">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Total Income
            </span>
            <br />
            <h1 className=" text-2xl font-semibold text-green-400">
              +${totalIncome}
            </h1>
          </div>
          <div className="flex flex-col justify-center items-center  rounded-lg  h-32 md:h-64 bg-neutral-100 drop-shadow-lg">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Total Expenses
            </span>
            <br />
            <h1 className=" text-2xl font-semibold text-red-400">
              -${totalExpenses}
            </h1>
          </div>
          <div className="flex flex-col justify-center items-center  rounded-lg bg-neutral-100 drop-shadow-lg h-32 md:h-64">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Total Profit
            </span>
            <br />
            <Profit />
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
            <tbody>{generateTransactionDivs()}</tbody>
          </table>
        </div>
        <div className="flex justify-center items-center mt-10">
          <button
            onClick={toggleTransactionModal}
            type="button"
            className="flex flex-initial mr-2 mb-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            <svg
              className="w-4 h-4 mr-2 text-white dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path d="M9.546.5a9.5 9.5 0 1 0 9.5 9.5 9.51 9.51 0 0 0-9.5-9.5ZM13.788 11h-3.242v3.242a1 1 0 1 1-2 0V11H5.304a1 1 0 0 1 0-2h3.242V5.758a1 1 0 0 1 2 0V9h3.242a1 1 0 1 1 0 2Z" />
            </svg>
            Add Transaction
          </button>
        </div>
      </main>
      {modalVisible && (
        <form
          id="AddTransaction"
          className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
          <div
            tabIndex="-1"
            aria-hidden="true"
            className="flex items-center justify-center h-full">
            <div className="relative w-full max-w-2xl max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Add Transaction
                  </h3>
                  <button
                    onClick={toggleTransactionModal}
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
                      Transaction Name
                    </label>
                    <input
                      onChange={(e) => setTransactionName(e.target.value)}
                      value={transactionName}
                      type="text"
                      id="name"
                      className="shadow-sm bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                      placeholder=""
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <button
                      onClick={toggleTransactionDropdown}
                      id="dropdownDefaultButton"
                      data-dropdown-toggle="dropdown"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3.5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      type="button">
                      {transactionCategory || "Transaction Category"}
                      <svg
                        className="w-2.5 h-2.5 ml-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6">
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 4 4 4-4"
                        />
                      </svg>
                    </button>

                    <div
                      id="dropdown"
                      className={`z-10 ${
                        dropdownVisible ? "" : "hidden"
                      } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefaultButton">
                        <li>
                          <a
                            onClick={() => {
                              setTransactionCategory("Income");
                              toggleTransactionDropdown();
                            }}
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                            Income
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={() => {
                              setTransactionCategory("Expenses");
                              toggleTransactionDropdown();
                            }}
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                            Expenses
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-6">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Transaction Amount
                      </label>
                      <input
                        onChange={(e) => setTransactionAmount(e.target.value)}
                        value={transactionAmount}
                        type="text"
                        id="name"
                        className="shadow-sm w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder=""
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                    onClick={handleAddTransaction}
                    data-modal-hide="AddTransaction"
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Add
                  </button>
                  <button
                    onClick={toggleTransactionModal}
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
      )}
      {editModalVisible && generateEditModal()}
      {BudgetEditModal && generateBudgetEditModal()}
    </>
  );
};

export default Budgets;
