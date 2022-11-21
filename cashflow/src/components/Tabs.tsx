import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { trpc } from "../utils/trpc";
import DropdownList from "./DropdownList";
import SubmitButton from "./SubmitButton";
import DeleteButton from "./DeleteButton";
import SwitchButton from "./Switch";
import FormField from "./FormField";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({
  tabNames,
  itemType,
  items,
}: {
  tabNames: string[];
  itemType: string;
  items: any;
}) {
  const [animateParent] = useAutoAnimate();
  const types = trpc.expenses.getTypeByType.useQuery({
    type: itemType,
  });
  const partners = trpc.expenses.getPartnersByType.useQuery({
    type: itemType,
  });
  const categories = trpc.expenses.getCategoriesByType.useQuery({
    type: itemType,
  });
  const connections = trpc.expenses.getConnectionsByType.useQuery({
    type: itemType,
  });
  const utils = trpc.useContext();
  const itemCreation = trpc.expenses.createItem.useMutation({
    async onMutate({ name, category, elem_tipus, partner, type }) {
      await utils.expenses.getItemByType.cancel();
      const tasks = items.data ?? [];
      utils.expenses.getItemByType.setData(
        [
          ...tasks,
          {
            name: name,
            elem_tipus: elem_tipus,
            kategoriakName: category,
            partnerName: partner,
            type: type,
          },
        ],
        { type: itemType }
      );
    },
  });
  const categoryCreation = trpc.expenses.createCategory.useMutation({
    async onMutate({ is_main, name, parent_name, tipus, is_active }) {
      await utils.expenses.getCategoriesByType.cancel();
      const tasks = categories.data ?? [];
      utils.expenses.getCategoriesByType.setData(
        [
          ...tasks,
          {
            is_main: is_main,
            name: name,
            parent_name: parent_name,
            tipus: tipus,
            is_active: is_active,
            id: `${Math.random()}`,
          },
        ],
        { type: itemType }
      );
    },
  });
  const [selectedItemType, setSelectedItemType] = useState<string>("");
  const [selectedItemPartner, setSelectedItemPartner] = useState<string>("");
  const [selectedItemCategory, setSelectedItemCategory] = useState<string>("");
  const [selectedItemName, setSelectedItemName] = useState<string>("");
  const handleItemSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    itemCreation.mutate({
      name: selectedItemName,
      elem_tipus: itemType,
      category: selectedItemCategory,
      partner: selectedItemPartner,
      type: selectedItemType,
    });
    setSelectedItemCategory("");
    setSelectedItemName("");
    setSelectedItemPartner("");
    setSelectedItemType("");
  };
  const handleCategorySubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    categoryCreation.mutate({
      is_active: selectedCategoryIsActive,
      is_main: selectedCategoryMaincategory,
      name: selectedCategoryName,
      parent_name: selectedCategoryParent,
      tipus: itemType,
    });
    setSelectedCategoryIsActive(true);
    setSelectedCategoryMaincategory(true);
    setSelectedCategoryName("");
    setSelectedCategoryParent("");
  };
  const [selectedCategoryIsActive, setSelectedCategoryIsActive] =
    useState<boolean>(true);
  const [selectedCategoryParent, setSelectedCategoryParent] =
    useState<string>("");
  const [selectedCategoryMaincategory, setSelectedCategoryMaincategory] =
    useState<boolean>(true);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");

  const [selectedConnectionItem, setSelectedConnectionItem] = useState("");
  const [selectedConnectionSample, setSelectedConnectionSample] = useState("");
  const [selectedConnectionPartner, setSelectedConnectionPartner] =
    useState("");
  const createConnection = trpc.expenses.createConnection.useMutation({
    async onMutate({ item, itemType, partner, sample }) {
      await utils.expenses.getConnectionsByType.cancel();
      const tasks = connections.data ?? [];
      utils.expenses.getConnectionsByType.setData(
        [
          ...tasks,
          {
            id: `${Math.random()}`,
            elemekName: item,
            minta: sample,
            partnerekName: partner,
            tipus: itemType,
          },
        ],
        { type: itemType }
      );
    },
  });

  const submitConnection = (e: any) => {
    e.preventDefault();
    createConnection.mutate({
      item: selectedConnectionItem,
      itemType: itemType,
      partner: selectedConnectionPartner,
      sample: selectedConnectionSample,
    });
    const ws = new WebSocket("wss://dataupload.xyz/ws/make_cashflow_planner/");
    utils.expenses.getAllIncomeExpense;
    setSelectedConnectionItem("");
    setSelectedConnectionPartner("");
    setSelectedConnectionSample("");
  };

  const createPartner = trpc.expenses.createPartner.useMutation({
    async onMutate({ name, type }) {
      await utils.expenses.getPartnersByType.cancel();
      const tasks = partners.data ?? [];
      utils.expenses.getPartnersByType.setData(
        [
          ...tasks,
          {
            id: `${Math.random()}`,
            name: name,
            tipus: type,
          },
        ],
        { type: itemType }
      );
    },
  });
  const [selectedPartnerName, setSelectedPartnerName] = useState("");
  const submitPartner = (e: any) => {
    e.preventDefault();
    createPartner.mutate({
      name: selectedPartnerName,
      type: itemType,
    });
    setSelectedPartnerName("");
  };

  const createType = trpc.expenses.createType.useMutation({
    async onMutate({ name, type }) {
      await utils.expenses.getTypeByType.cancel();
      const tasks = types.data ?? [];
      utils.expenses.getTypeByType.setData(
        [
          ...tasks,
          {
            name: name,
            tipus: type,
          },
        ],
        { type: itemType }
      );
    },
  });
  const [selectedTypeName, setSelectedTypeName] = useState("");
  const submitType = (e: any) => {
    e.preventDefault();
    createType.mutate({
      name: selectedTypeName,
      type: itemType,
    });
    setSelectedTypeName("");
  };

  useEffect(() => {
    if (types.data && typeof types.data[0] !== "undefined") {
      setSelectedItemType(types.data[0].name);
    }
  }, []);
  return (
    <div className="w-full max-w-md px-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabNames.map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-3 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-sky-900 text-white shadow"
                    : "text-gray-600 hover:bg-white/[0.12] hover:text-black"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel
            className={classNames(
              "rounded-xl bg-white p-3",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
            )}
          >
            <form className="w-full max-w-lg pt-6">
              <div className="-mx-3 mb-6 flex flex-wrap">
                <div className="mb-6 w-full px-3 md:mb-0 md:w-1/2">
                  <div className="w-full md:w-1/2">
                    <label
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                      htmlFor="grid-last-name"
                    >
                      Név
                    </label>
                    <input
                      value={selectedItemName}
                      className="block appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                      style={{ width: 400 }}
                      id="grid-last-name"
                      type="text"
                      onChange={(e) => setSelectedItemName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="float-right inline-block">
                <DropdownList
                  label="Típus"
                  options={
                    types.data ? types.data.map((type) => type.name) : [""]
                  }
                  selected={selectedItemType}
                  setSelected={setSelectedItemType}
                />
              </div>
              <div className="float-left inline-block">
                <DropdownList
                  label="Partner"
                  options={
                    partners.data
                      ? partners.data.map((partner) => partner.name)
                      : [""]
                  }
                  selected={selectedItemPartner}
                  setSelected={setSelectedItemPartner}
                />
              </div>
              <div style={{ width: 400 }} className="mt-8 inline-block">
                <DropdownList
                  label="Kategória"
                  options={
                    categories.data
                      ? categories.data.map((category) => category.name)
                      : [""]
                  }
                  selected={selectedItemCategory}
                  setSelected={setSelectedItemCategory}
                />
              </div>
              <div className="relative top-12">
                <SubmitButton onClick={handleItemSubmit} title="Hozzáadás" />
              </div>
              <div className="relative top-2 left-72 ml-1">
                <DeleteButton
                  title="Törlés"
                  onClick={(e: any) => {
                    e.preventDefault();
                    setSelectedItemCategory("");
                    setSelectedItemName("");
                    setSelectedItemPartner("");
                    setSelectedItemType("");
                  }}
                />
              </div>
            </form>
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              "rounded-xl bg-white p-3",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
            )}
          >
            <form className="w-full max-w-lg pt-6">
              <div className="mb-5 flex flex-row py-2">
                <label
                  className="basis-4/5 text-xs font-bold uppercase tracking-wide text-gray-700"
                  htmlFor="grid-last-name"
                >
                  Főkategória?
                </label>
                <SwitchButton
                  enabled={selectedCategoryMaincategory}
                  setEnabled={setSelectedCategoryMaincategory}
                />
              </div>
              <div className="flex flex-row">
                <div className="-mx-3 flex flex-row flex-wrap pr-1">
                  <div className="mb-6 px-3 md:mb-0 md:w-1/2">
                    <div className="md:w-1/2">
                      <label
                        className="block pb-2 text-xs font-bold uppercase tracking-wide text-gray-700"
                        htmlFor="grid-last-name"
                      >
                        Név
                      </label>
                      <input
                        value={selectedCategoryName}
                        className="appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                        style={{
                          width: selectedCategoryMaincategory ? 400 : 200,
                        }}
                        id="grid-last-name"
                        type="text"
                        onChange={(e) =>
                          setSelectedCategoryName(e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                {!selectedCategoryMaincategory && (
                  <div style={{ width: 200 }} className="inline-block pl-1">
                    <DropdownList
                      label="Szülő"
                      options={
                        categories.data
                          ? categories.data.map((category) => category.name)
                          : [""]
                      }
                      selected={selectedCategoryParent}
                      setSelected={setSelectedCategoryParent}
                    />
                  </div>
                )}
              </div>
              <div className="mb-5 mt-8 flex flex-row py-2">
                <label
                  className="basis-4/5 text-xs font-bold uppercase tracking-wide text-gray-700"
                  htmlFor="grid-last-name"
                >
                  Aktív?
                </label>
                <SwitchButton
                  enabled={selectedCategoryIsActive}
                  setEnabled={setSelectedCategoryIsActive}
                />
              </div>
              <div className="relative top-12">
                <SubmitButton
                  onClick={handleCategorySubmit}
                  title="Hozzáadás"
                />
              </div>
              <div className="relative top-2 left-72 ml-1">
                <DeleteButton
                  title="Törlés"
                  onClick={(e: any) => {
                    e.preventDefault();
                    setSelectedCategoryName("");
                    setSelectedCategoryParent("");
                    setSelectedCategoryMaincategory(true);
                    setSelectedCategoryIsActive(true);
                  }}
                />
              </div>
            </form>
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              "rounded-xl bg-white p-3",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
            )}
          >
            <form className="w-full max-w-lg pt-6">
              <div>
                <DropdownList
                  label="Partner"
                  options={
                    partners.data
                      ? partners.data.map((partner) => partner.name)
                      : [""]
                  }
                  selected={selectedConnectionPartner}
                  setSelected={setSelectedConnectionPartner}
                />
              </div>
              <div className="mt-6">
                <FormField
                  setSelected={setSelectedConnectionSample}
                  selected={selectedConnectionSample}
                  label="Minta"
                />
              </div>
              <div ref={animateParent}>
                {selectedConnectionPartner && (
                  <div className="mt-6">
                    <DropdownList
                      label="Elem"
                      options={items.data
                        ?.filter(
                          (item: any) =>
                            item.partnerName === selectedConnectionPartner
                        )
                        .map((item: any) => item.name)}
                      selected={selectedConnectionItem}
                      setSelected={setSelectedConnectionItem}
                    />
                  </div>
                )}
              </div>
              <div className="relative top-12">
                <SubmitButton onClick={submitConnection} />
              </div>
              <div className="relative top-2 left-72 ml-1">
                <DeleteButton
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedConnectionItem("");
                    setSelectedConnectionPartner("");
                    setSelectedConnectionSample("");
                  }}
                />
              </div>
            </form>
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              "rounded-xl bg-white p-3",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
            )}
          >
            <form className="w-full max-w-lg pt-6">
              <div>
                <FormField
                  label="Partner"
                  selected={selectedPartnerName}
                  setSelected={setSelectedPartnerName}
                />
              </div>
              <div className="relative top-12">
                <SubmitButton onClick={submitPartner} />
              </div>
              <div className="relative top-2 left-72 ml-1">
                <DeleteButton
                  onClick={(e: any) => {
                    e.preventDefault();
                    setSelectedPartnerName("");
                  }}
                />
              </div>
            </form>
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              "rounded-xl bg-white p-3",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
            )}
          >
            <form className="w-full max-w-lg pt-6">
              <div>
                <FormField
                  label="Típus"
                  selected={selectedTypeName}
                  setSelected={setSelectedTypeName}
                />
              </div>
              <div className="relative top-12">
                <SubmitButton onClick={submitType} />
              </div>
              <div className="relative top-2 left-72 ml-1">
                <DeleteButton
                  onClick={(e: any) => {
                    e.preventDefault();
                    setSelectedTypeName("");
                  }}
                />
              </div>
            </form>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
