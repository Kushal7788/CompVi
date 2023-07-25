import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export const Prover = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  let { checkId } = useParams();
  const [claimUrl, setClaimUrl] = useState(null);

  const [selectedOption, setSelectedOption] = useState("Google");
  // const param ={
  //   checkId: checkId,
  // }
  const postData = async (emailProvider) => {
    try {
      let url = `${apiUrl}/update/email-provider/${checkId}`;

      let options = {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailProvider: emailProvider }),
      };
      const res = await fetch(url, options);
      const data = await res.json();
      setClaimUrl(data.url);
      console.log(claimUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

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

      <section class="text-gray-600 body-font">
        <div class="container px-5 py-24 mx-auto">
          <div class="flex flex-col text-center w-full mb-12">
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Prove Identity & Professional Credentials
            </h1>
          </div>
          <div class="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 justify-center  sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-center sm:items-end">
            <div class="relative flex-grow w-full h-full">
              <label for="countries" class="block mb-2 text-xl font-medium ">
                Select your Email Provider
              </label>
              <select
                value={selectedOption}
                onChange={handleOptionChange}
                id="countries"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-xl py-3  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:h-[60px] p-2.5 "
              >
                <option value={"Google"}>Google</option>
                <option value={"Outlook"}>Outlook</option>
                <option value={"GoDaddy"}>GoDaddy</option>
              </select>
            </div>
            <button
              onClick={() => postData(selectedOption)}
              class="text-white sm:h-[60px] bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded-lg text-xl"
            >
              Submit
            </button>
          </div>

          {claimUrl !== null && (
            <div className="flex flex-col justify-center items-center gap-4 text-center w-full mt-12">
              <p class="sm:text-3xl hidden md:block text-2xl font-medium title-font mb-4 text-gray-900">
                Scan in Reclaim App
              </p>

              <QRCodeSVG className="hidden md:block" height={200} width={200} value={claimUrl} />
              <div className="flex-row p-5 rounded-lg  gap-4">
                <a target="_blank" href={claimUrl}>
                  <button class="  text-white w-full bg-indigo-500 border-0 py-2 px-6 focus:outline-none m-2 hover:bg-indigo-600 rounded-xl text-lg">
                    Open Magic Link ✨{" "}
                  </button>
                </a>
                <button
                  onClick={() => handleCopyLink(claimUrl)}
                  class="  text-gray-700 w-full bg-gray-100 border-0 py-2 px-6 focus:outline-none m-2 hover:bg-gray-200 rounded-xl text-lg"
                >
                  Copy Reclaim Magic Link ✨
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
