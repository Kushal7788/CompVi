import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export const Verifier = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const baseUrl = `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? `:${window.location.port}` : ""
  }`;
  let { checkId } = useParams();
  const [data, setData] = useState(null);
  const [companyName, setComapanyName] = useState("");
  const [emailProvider, setEmailProvider] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch(`${apiUrl}/fetch/${checkId}`);
      const data = await res.json();
      setData(data.data);
      setEmailProvider(data.data?.emailProvider);
      setComapanyName(data.data?.proofs[0]?.parameters?.companyName);
    } catch (err) {
      console.log(err);
    }
  };

  const handleShare = async (link) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share verification link",
          text: "verification link",
          url: `${link}`,
        });
      } catch (err) {
      console.log(err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(link);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  };

  useEffect(() => {
    setInterval(fetchData, 5000);
  }, []);

  return (
    <div className="">
      <Toaster />
      <header class="text-gray-600 body-font border ">
        <div class="container mx-auto flex flex-wrap justify-between p-5 flex-col md:flex-row items-center">
          <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <img
              src="https://assets.website-files.com/63f580596efa74629ceecdf5/646cd0d4bff811689094709c_Reclaim-Logo-Asterisk.jpg"
              class="w-10 h-10 rounded-full"
            />

            <span class="ml-3 font-bold text-xl">Verify your Employment</span>
          </a>
          <a href="https://www.reclaimprotocol.org/">
            <button class="inline-flex cursor-pointer items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
              🔗 Reclaim Protocol
            </button>
          </a>
        </div>
      </header>

      <div className="flex my-14">
        <section class="mt-4 text-gray-600 p-3 h-full md:flex flex-row gap-4 w-full body-font ">
          <div class="container mx-auto   rounded-lg flex h-full p-3 items-center justify-center flex-col">
            <div class="text-center s lg:w-2/3 w-full">
              <p class="mb-8 leading-relaxed">
                Share this to person for validating their Employment
              </p>
              <p class="mb-8 hover:underline text-blue-700 text-xl leading-relaxed truncate">
                <a
                  href={`${baseUrl}/prover/${checkId}`}
                >{`${baseUrl}/prover/${checkId}`}</a>
              </p>
              <div class="flex justify-center">
                <button
                  onClick={() => handleShare(`${baseUrl}/prover/${checkId}`)}
                  class="inline-flex text-white bg-purple-500 border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded text-lg"
                >
                  Share verification link ✨
                </button>
              </div>
            </div>
          </div>

          <div class="container  px-5 py-10 mx-auto">
            <div class="flex flex-col text-center w-full">
              <h1 class="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
                Status
              </h1>
              <p class="lg:w-2/3 mx-auto  ">
                Get realtime update of Verication
              </p>
            </div>
            {!data && (
              <div class="bg-white p-2 sm:p-4 sm:h-64 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-5 select-none ">
                <div class="h-52 sm:h-full sm:w-72 rounded-xl bg-gray-200 animate-pulse"></div>
                <div class="flex flex-col flex-1 gap-5 sm:p-2">
                  <div class="flex flex-1 flex-col gap-3">
                    <div class="bg-gray-200 w-full animate-pulse h-14 rounded-2xl"></div>
                    <div class="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                    <div class="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                    <div class="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                    <div class="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                  </div>
                  <div class="mt-auto flex gap-3">
                    <div class="bg-gray-200 w-20 h-8 animate-pulse rounded-full"></div>
                    <div class="bg-gray-200 w-20 h-8 animate-pulse rounded-full"></div>
                    <div class="bg-gray-200 w-20 h-8 animate-pulse rounded-full ml-auto"></div>
                  </div>
                </div>
              </div>
            )}

            {data && (
              <div class=" w-full mx-auto flex justify-center overflow-auto">
                <div class="flex flex-col text-xl  gap-4 w-full mt-5">
                  <div className="flex w-full justify-between p-4 rounded-xl border">
                    {" "}
                    <p className="capitalize font-bold">
                      {emailProvider ? "Email Provider" : "Locating Email Provider 📍"}
                    </p>
                    <p>
                      {emailProvider ? (
                        emailProvider
                      ) : (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span class="sr-only">Loading...</span>
                        </div>
                      )}
                    </p>
                  </div>
                  <div className="flex w-full justify-between p-4 rounded-xl border">
                    {" "}
                    <p className="capitalize font-bold">
                      {companyName ? "Verified Employment ✅" : "Verifying Employemnt ⌛️"}
                    </p>
                    <p>
                      {companyName ? (
                        <p className="font-bold"> {companyName}</p>
                      ) : (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span class="sr-only">Loading...</span>
                        </div>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <footer class="text-gray-600 fixed w-full m-auto hidden md:block  bottom-0  body-font">
        <div class="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <a class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <img
              class="w-10 h-10 rounded-full"
              src="data:image/jpeg;base64,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"
            />
            <span class="ml-3 text-xl">Powered by QuestBook</span>
          </a>
          <p class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          Verify your Employment
          </p>
          <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <a
              href="https://twitter.com/protocolreclaim"
              class="ml-3 text-gray-500"
            >
              <svg
                fill="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                class="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
};
