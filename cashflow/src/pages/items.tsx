import React, { useState } from "react";
import FormField from "../components/FormField";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import SwitchButton from "../components/Switch";
import SubmitButton from "../components/SubmitButton";
import { Dialog, Group, useMantineTheme, Text, Modal } from "@mantine/core";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import Radio from "../components/Radio";
import { DataGrid, GridValueFormatterParams } from "@mui/x-data-grid";
import { trpc } from "../utils/trpc";
import { GridColDef } from "@mui/x-data-grid";
import Tabs from "../components/Tabs";
import DropdownList from "../components/DropdownList";
import {
  ChevronDownIcon,
  PencilIcon,
  ChevronUpIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const booleanFormatter = (params: GridValueFormatterParams<boolean>) => {
  if (params.value === null) {
    return "-";
  }
  if (params.value) {
    return "Igen";
  }
  return "Nem";
};

export default function Datas() {
  const [animateParent] = useAutoAnimate<HTMLDivElement>();
  const utils = trpc.useContext();
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const [itemType, setItemType] = React.useState<string | null>("");
  const singularItemType = itemType
    ? itemType.substring(0, itemType.length - 2)
    : "";

  const typeColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Típus",
      width: 420,
    },
  ];
  const partnerColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Partner",
      width: 420,
    },
  ];
  const categoryColumns: GridColDef[] = [
    {
      field: "name",
      headerName: `Kategória`,
      width: 208,
    },
    {
      field: "is_main",
      headerName: "Főkategória?",
      width: 150,
      valueFormatter: booleanFormatter,
    },
    {
      field: "parent_name",
      headerName: "Szülő név (ha alkategória)",
      width: 200,
    },
    {
      field: "is_active",
      headerName: "Aktív?",
      width: 150,
      valueFormatter: booleanFormatter,
    },
  ];
  const itemColumns: GridColDef[] = [
    {
      field: "name",
      headerName: `Tétel`,
      width: 180,
    },
    {
      field: "type",
      headerName: `Típus`,
      width: 150,
    },
    {
      field: "partnerName",
      headerName: "Partner",
      width: 170,
    },
    {
      field: "kategoriakName",
      headerName: "Kategória",
      width: 190,
    },
  ];
  const connectionColumns = [
    {
      field: "elemekId",
      headerName: "Elem",
      width: 200,
      valueGetter: (params: GridValueFormatterParams) => {
        if (items.data) {
          return items.data.find((item) => item.id === params.value)?.name;
        }
      },
    },
    {
      field: "minta",
      headerName: "Minta",
      width: 150,
    },
    {
      field: "partnerekName",
      headerName: "Partner",
      width: 150,
    },
  ];
  const tabs = ["Tétel", "Kategória", "Kapcsolat", "Partnerek", "Típusok"];
  const categories = trpc.expenses.getCategoriesByType.useQuery({
    type: singularItemType.toLowerCase(),
  });
  const items = trpc.expenses.getItemByType.useQuery(
    {
      type: singularItemType.toLowerCase(),
    },
    { staleTime: 3000 }
  );
  const types = trpc.expenses.getTypeByType.useQuery({
    type: singularItemType.toLowerCase(),
  });
  const connections = trpc.expenses.getConnectionsByType.useQuery({
    type: singularItemType.toLowerCase(),
  });
  const partners = trpc.expenses.getPartnersByType.useQuery({
    type: singularItemType.toLowerCase(),
  });
  React.useEffect(() => {
    setItemType(window.sessionStorage.getItem("itemType"));
  }, []);
  const [itemSelectionModel, setItemSelectionModel] = useState<string[]>([]);
  const [categorySelectionModel, setCategorySelectionModel] = useState<
    string[]
  >([]);
  const [connectionSelectionModel, setConnectionSelectionModel] = useState<
    string[]
  >([]);
  const [partnerSelectionModel, setPartnerSelectionModel] = useState<string[]>(
    []
  );
  const [typeSelectionModel, setTypeSelectionModel] = useState<string[]>([]);
  const [expandedDeleteDialog, setExpandedDeleteDialog] = useState(false);
  const deleteItem = trpc.expenses.deleteItem.useMutation({
    async onMutate({ id }) {
      await utils.expenses.getItemByType.cancel();
      const allTasks =
        utils.expenses.getItemByType.getData({
          type: singularItemType.toLowerCase(),
        }) ?? [];
      utils.expenses.getItemByType.setData(
        { type: singularItemType.toLowerCase() },
        allTasks.filter((t) => t.id != id)
      );
    },
  });
  const deleteConnection = trpc.expenses.deleteConnection.useMutation({
    async onMutate({ id }) {
      await utils.expenses.getConnectionsByType.cancel();
      const allTasks =
        utils.expenses.getConnectionsByType.getData({
          type: singularItemType.toLowerCase(),
        }) ?? [];
      utils.expenses.getConnectionsByType.setData(
        { type: singularItemType.toLowerCase() },
        allTasks.filter((t) => t.id != id)
      );
    },
  });
  const deleteCategory = trpc.expenses.deleteCategory.useMutation({
    async onMutate({ id }) {
      await utils.expenses.getCategoriesByType.cancel();
      const allTasks =
        utils.expenses.getCategoriesByType.getData({
          type: singularItemType.toLowerCase(),
        }) ?? [];
      utils.expenses.getCategoriesByType.setData(
        { type: singularItemType.toLowerCase() },
        allTasks.filter((t) => t.id != id)
      );
    },
  });
  const deleteType = trpc.expenses.deleteType.useMutation({
    async onMutate({ id }) {
      await utils.expenses.getTypeByType.cancel();
      const allTasks =
        utils.expenses.getTypeByType.getData({
          type: singularItemType.toLowerCase(),
        }) ?? [];
      utils.expenses.getTypeByType.setData(
        { type: singularItemType.toLowerCase() },
        allTasks.filter((t) => t.id != id)
      );
    },
  });
  const deletePartner = trpc.expenses.deletePartner.useMutation({
    async onMutate({ id }) {
      await utils.expenses.getPartnersByType.cancel();
      const allTasks =
        utils.expenses.getPartnersByType.getData({
          type: singularItemType.toLowerCase(),
        }) ?? [];
      utils.expenses.getPartnersByType.setData(
        { type: singularItemType.toLowerCase() },
        allTasks.filter((t) => t.id != id)
      );
    },
  });
  const deleteAll = () => {
    itemSelectionModel.map((item) => deleteItem.mutate({ id: item }));
    categorySelectionModel.map((category) =>
      deleteCategory.mutate({ id: category })
    );
    connectionSelectionModel.map((connection) =>
      deleteConnection.mutate({ id: connection })
    );
    partnerSelectionModel.map((partner) =>
      deletePartner.mutate({ id: partner })
    );
    typeSelectionModel.map((type) => deleteType.mutate({ id: type }));
  };
  const categoryDetails = categories.data?.find(
    (category) => category.id === categorySelectionModel[0]
  );
  const itemDetails = items.data?.find(
    (item) => item.id === itemSelectionModel[0]
  );
  const connectionDetails = connections.data?.find(
    (connection) => connection.id === connectionSelectionModel[0]
  );
  const typeDetails = types.data?.find(
    (type) => type.id === typeSelectionModel[0]
  );
  const partnerDetails = partners.data?.find(
    (partner) => partner.id === partnerSelectionModel[0]
  );
  const currentlyEditedItem = itemSelectionModel.length
    ? "Elem"
    : categorySelectionModel.length
    ? "Kategória"
    : connectionSelectionModel.length
    ? "Kapcsolat"
    : partnerSelectionModel.length
    ? "Partner"
    : typeSelectionModel.length
    ? "Típus"
    : "";
  const [editedItem, setEditedItem] = React.useState<any>();
  const [editedCategory, setEditedCategory] =
    React.useState<typeof categoryDetails>();
  const [editedConnection, setEditedConnection] =
    React.useState<typeof connectionDetails>();
  const [editedPartner, setEditedPartner] =
    React.useState<typeof partnerDetails>();
  const [editedType, setEditedType] = React.useState<typeof typeDetails>();
  React.useEffect(() => {
    if (itemDetails) {
      setEditedItem(itemDetails);
    }
  }, [itemDetails]);
  React.useEffect(() => {
    if (categoryDetails) {
      setEditedCategory(categoryDetails);
    }
  }, [categoryDetails]);
  React.useEffect(() => {
    if (connectionDetails) {
      setEditedConnection(connectionDetails);
    }
  }, [connectionDetails]);
  React.useEffect(() => {
    if (partnerDetails) {
      setEditedPartner(partnerDetails);
    }
  }, [partnerDetails]);
  React.useEffect(() => {
    if (typeDetails) {
      setEditedType(typeDetails);
    }
  }, [typeDetails]);
  const updateItem = trpc.expenses.updateItem.useMutation({
    async onMutate({
      elem_tipus,
      id,
      kategoriakName,
      name,
      partnerName,
      type,
    }) {
      await utils.expenses.getItemByType.cancel();
      const allTasks = utils.expenses.getItemByType.getData({
        type: singularItemType.toLowerCase(),
      });
      if (!allTasks) {
        return;
      }
      utils.expenses.getItemByType.setData(
        { type: singularItemType.toLowerCase() },
        allTasks.map((t) =>
          t.id === itemSelectionModel[0]
            ? {
                ...t,
                ...{
                  elem_tipus: elem_tipus,
                  id: id,
                  partnerName: partnerName,
                  name: name,
                  type: type,
                  kategoriakName: kategoriakName,
                },
              }
            : t
        )
      );
    },
  });
  const updateCategory = trpc.expenses.updateCategory.useMutation({
    async onMutate({ id, is_active, is_main, name, parent_name }) {
      await utils.expenses.getCategoriesByType.cancel();
      const allCategories = utils.expenses.getCategoriesByType.getData({
        type: singularItemType.toLowerCase(),
      });
      if (!allCategories) {
        return;
      }
      utils.expenses.getCategoriesByType.setData(
        {
          type: singularItemType.toLowerCase(),
        },
        allCategories.map((t) =>
          t.id === id
            ? {
                ...t,
                ...{
                  id: id,
                  is_active: is_active,
                  is_main: is_main,
                  name: name,
                  parent_name: is_main ? "" : parent_name,
                  tipus: singularItemType.toLowerCase(),
                },
              }
            : t
        )
      );
    },
  });
  const updateConnection = trpc.expenses.updateConnection.useMutation({
    async onMutate({ elemekId, id, minta, partnerekName }) {
      await utils.expenses.getConnectionsByType.cancel();
      const allCategories = utils.expenses.getConnectionsByType.getData({
        type: singularItemType.toLowerCase(),
      });
      if (!allCategories) {
        return;
      }
      utils.expenses.getConnectionsByType.setData(
        {
          type: singularItemType.toLowerCase(),
        },
        allCategories.map((t) =>
          t.id === id
            ? {
                ...t,
                ...{
                  elemekId: elemekId,
                  id: id,
                  minta: minta,
                  partnerekName: partnerekName,
                  tipus: singularItemType.toLowerCase(),
                },
              }
            : t
        )
      );
    },
  });
  const updatePartner = trpc.expenses.updatePartner.useMutation({
    async onMutate({ id, name }) {
      await utils.expenses.getPartnersByType.cancel();
      const allCategories = utils.expenses.getPartnersByType.getData({
        type: singularItemType.toLowerCase(),
      });
      if (!allCategories) {
        return;
      }
      utils.expenses.getPartnersByType.setData(
        {
          type: singularItemType.toLowerCase(),
        },
        allCategories.map((t) =>
          t.id === id
            ? {
                ...t,
                ...{
                  id: id,
                  name: name,
                  tipus: singularItemType.toLowerCase(),
                },
              }
            : t
        )
      );
    },
  });
  const updateType = trpc.expenses.updateType.useMutation({
    async onMutate({ id, name }) {
      await utils.expenses.getTypeByType.cancel();
      const allCategories = utils.expenses.getTypeByType.getData({
        type: singularItemType.toLowerCase(),
      });
      if (!allCategories) {
        return;
      }
      utils.expenses.getTypeByType.setData(
        {
          type: singularItemType.toLowerCase(),
        },
        allCategories.map((t) =>
          t.id === id
            ? {
                ...t,
                ...{
                  id: id,
                  name: name,
                  tipus: singularItemType.toLowerCase(),
                },
              }
            : t
        )
      );
    },
  });
  const handleItemUpdate = (e: any) => {
    e.preventDefault();
    if (editedItem) {
      updateItem.mutate(editedItem);
    }
    setOpened(false);
  };
  const handleCategoryUpdate = (e: any) => {
    e.preventDefault();
    if (editedCategory) {
      updateCategory.mutate(editedCategory);
    }
    setOpened(false);
  };
  const handleConnectionUpdate = (e: any) => {
    e.preventDefault();
    if (editedConnection) {
      updateConnection.mutate(editedConnection);
    }
    setOpened(false);
  };
  const handlePartnerUpdate = (e: any) => {
    e.preventDefault();
    if (editedPartner) {
      updatePartner.mutate(editedPartner);
    }
    setOpened(false);
  };
  const handleTypeUpdate = (e: any) => {
    e.preventDefault();
    if (editedType) {
      updateType.mutate(editedType);
    }
    setOpened(false);
  };
  return (
    <div>
      <Navbar currentPage="Adatok" />
      <Dialog
        position={{ top: 20, left: 20 }}
        sx={{ width: 300 }}
        opened={
          itemSelectionModel.length > 0 ||
          categorySelectionModel.length > 0 ||
          connectionSelectionModel.length > 0 ||
          partnerSelectionModel.length > 0 ||
          typeSelectionModel.length > 0
        }
        onClose={() => {
          setItemSelectionModel([]);
          setCategorySelectionModel([]);
          setConnectionSelectionModel([]);
          setPartnerSelectionModel([]);
          setTypeSelectionModel([]);
        }}
        size="xl"
        radius="md"
      >
        <div className="flex">
          <div className="mt-2 grow">
            <Text size="sm" style={{ marginBottom: 10 }} weight={500}>
              <p className="float-left mr-1 inline-block font-bold">
                {itemSelectionModel.length +
                  categorySelectionModel.length +
                  connectionSelectionModel.length +
                  partnerSelectionModel.length +
                  typeSelectionModel.length}
              </p>
              elem törlése
            </Text>
            {expandedDeleteDialog && (
              <>
                <Text size="sm" style={{ marginBottom: 10 }} weight={400}>
                  Kategória:{" "}
                  <p className="float-right inline-block font-bold">
                    {categorySelectionModel.length}
                  </p>
                </Text>
                <Text size="sm" style={{ marginBottom: 10 }} weight={400}>
                  Kapcsolat:
                  <p className="float-right inline-block font-bold">
                    {connectionSelectionModel.length}
                  </p>
                </Text>
                <Text size="sm" style={{ marginBottom: 10 }} weight={400}>
                  Partner:
                  <p className="float-right inline-block font-bold">
                    {partnerSelectionModel.length}
                  </p>
                </Text>
                <Text size="sm" style={{ marginBottom: 10 }} weight={400}>
                  Típus:
                  <p className="float-right inline-block font-bold">
                    {typeSelectionModel.length}
                  </p>
                </Text>
                <Text size="sm" style={{ marginBottom: 10 }} weight={400}>
                  Elem:
                  <p className="float-right inline-block font-bold">
                    {itemSelectionModel.length}
                  </p>
                </Text>
              </>
            )}
          </div>
          <div className="relative top-2 grow">
            {expandedDeleteDialog ? (
              <ChevronUpIcon
                width={20}
                onClick={() => setExpandedDeleteDialog(false)}
                className="cursor-pointer"
              />
            ) : (
              <ChevronDownIcon
                width={20}
                onClick={() => setExpandedDeleteDialog(true)}
                className="cursor-pointer"
              />
            )}
          </div>
          <button
            onClick={deleteAll}
            className="h-9 rounded bg-red-700 py-2 px-4 align-middle font-bold text-white hover:bg-red-600"
          >
            <TrashIcon
              width={20}
              height={20}
              className="float-left inline-block"
            />
          </button>
        </div>
      </Dialog>
      <Dialog
        position={{ top: 20, right: 20 }}
        sx={{ width: 400 }}
        opened={
          (itemSelectionModel.length > 0 ||
            categorySelectionModel.length > 0 ||
            connectionSelectionModel.length > 0 ||
            partnerSelectionModel.length > 0 ||
            typeSelectionModel.length > 0) &&
          itemSelectionModel.length +
            categorySelectionModel.length +
            connectionSelectionModel.length +
            partnerSelectionModel.length +
            typeSelectionModel.length ===
            1
        }
        onClose={() => {
          setItemSelectionModel([]);
          setCategorySelectionModel([]);
          setConnectionSelectionModel([]);
          setPartnerSelectionModel([]);
          setTypeSelectionModel([]);
        }}
        size="xl"
        radius="md"
      >
        <div className="flex">
          <div className="mt-2 grow">
            <Text size="sm" style={{ marginBottom: 10 }} weight={500}>
              <p className="float-left mr-1 inline-block font-bold">
                {itemSelectionModel.length
                  ? itemDetails
                    ? itemDetails.name + " (Elem)"
                    : "Elem"
                  : categorySelectionModel.length
                  ? categoryDetails
                    ? categoryDetails.name + " (Kategória)"
                    : ""
                  : connectionSelectionModel.length
                  ? connectionDetails
                    ? connectionDetails.minta + " (Kapcsolat)"
                    : ""
                  : partnerSelectionModel.length
                  ? partnerDetails
                    ? partnerDetails.name + " (Partner)"
                    : ""
                  : typeSelectionModel.length
                  ? typeDetails
                    ? typeDetails.name + " (Típus)"
                    : ""
                  : ""}
              </p>
              megváltoztatása
            </Text>
          </div>
          <button
            className="h-9 rounded bg-green-700 py-2 px-4 align-middle font-bold text-white hover:bg-green-600"
            onClick={() => setOpened(true)}
          >
            <Modal
              overlayColor={
                theme.colorScheme === "dark"
                  ? theme.colors.dark[9]
                  : theme.colors.gray[2]
              }
              overlayOpacity={0.55}
              overlayBlur={3}
              transition="fade"
              transitionDuration={600}
              transitionTimingFunction="ease"
              opened={opened}
              title={currentlyEditedItem}
              onClose={() => setOpened(false)}
            >
              {currentlyEditedItem === "Elem" ? (
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
                          value={editedItem?.name}
                          className="block appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                          style={{ width: 400 }}
                          id="grid-last-name"
                          type="text"
                          onChange={(e) =>
                            setEditedItem((prev: any) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
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
                      selected={
                        editedItem
                          ? editedItem.type != null
                            ? editedItem.type
                            : ""
                          : ""
                      }
                      setSelected={(e) =>
                        setEditedItem({ ...editedItem, type: e })
                      }
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
                      selected={editedItem ? editedItem.partnerName : ""}
                      setSelected={(e) =>
                        setEditedItem({
                          ...editedItem,
                          partnerName: e,
                        })
                      }
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
                      selected={
                        editedItem
                          ? editedItem.kategoriakName === null
                            ? ""
                            : editedItem.kategoriakName
                          : ""
                      }
                      setSelected={(e) =>
                        setEditedItem({ ...editedItem, kategoriakName: e })
                      }
                    />
                  </div>
                  <div className="relative top-12">
                    <SubmitButton
                      onClick={handleItemUpdate}
                      title="Frissítés"
                    />
                  </div>
                </form>
              ) : currentlyEditedItem === "Kategória" ? (
                <form className="w-full max-w-lg pt-6">
                  <div className="mb-5 flex flex-row py-2">
                    <label
                      className="basis-4/5 text-xs font-bold uppercase tracking-wide text-gray-700"
                      htmlFor="grid-last-name"
                    >
                      Főkategória?
                    </label>
                    <SwitchButton
                      enabled={editedCategory ? editedCategory.is_main : false}
                      activeSign={false}
                      setEnabled={(e) =>
                        setEditedCategory((prev: any) => ({
                          ...prev,
                          is_main: e,
                        }))
                      }
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
                            value={editedCategory?.name}
                            className="appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                            style={{
                              width: editedCategory?.is_main ? 400 : 200,
                            }}
                            id="grid-last-name"
                            type="text"
                            onChange={(e) =>
                              setEditedCategory((prev: any) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                    {!editedCategory?.is_main && (
                      <div style={{ width: 200 }} className="inline-block pl-1">
                        <DropdownList
                          label="Szülő"
                          options={
                            categories.data
                              ? categories.data.map((category) => category.name)
                              : [""]
                          }
                          selected={
                            editedCategory ? editedCategory.parent_name : ""
                          }
                          setSelected={(e) =>
                            setEditedCategory((prev: any) => ({
                              ...prev,
                              parent_name: e,
                            }))
                          }
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
                      enabled={editedCategory ? editedCategory.is_active : true}
                      activeSign={false}
                      setEnabled={(e) =>
                        setEditedCategory((prev: any) => ({
                          ...prev,
                          is_active: e,
                        }))
                      }
                    />
                  </div>
                  <div className="relative top-12">
                    <SubmitButton
                      onClick={handleCategoryUpdate}
                      title="Frissítés"
                    />
                  </div>
                </form>
              ) : currentlyEditedItem === "Kapcsolat" ? (
                <form className="w-full max-w-lg pt-6">
                  <div>
                    <DropdownList
                      label="Partner"
                      options={
                        partners.data
                          ? partners.data.map((partner) => partner.name)
                          : [""]
                      }
                      selected={
                        editedConnection ? editedConnection.partnerekName : ""
                      }
                      setSelected={(e) =>
                        setEditedConnection((prev: any) => ({
                          ...prev,
                          partnerekName: e,
                        }))
                      }
                    />
                  </div>
                  <div className="mt-6">
                    <FormField
                      setSelected={(e) =>
                        setEditedConnection((prev: any) => ({
                          ...prev,
                          minta: e,
                        }))
                      }
                      selected={editedConnection ? editedConnection.minta : ""}
                      label="Minta"
                    />
                  </div>
                  <div ref={animateParent}>
                    {(editedConnection
                      ? editedConnection.partnerekName
                      : "") && (
                      <div className="mt-6">
                        <DropdownList
                          label="Elem"
                          options={
                            items.data
                              ? items.data
                                  .filter(
                                    (item: any) =>
                                      item.partnerName ===
                                      (editedConnection
                                        ? editedConnection.partnerekName
                                        : "")
                                  )
                                  .map((item: any) => item.name)
                              : [""]
                          }
                          selected={
                            editedConnection
                              ? items.data
                                ? items.data.find(
                                    (item) =>
                                      item.id === editedConnection.elemekId
                                  )?.name
                                : ""
                              : ""
                          }
                          setSelected={(e) =>
                            setEditedConnection((prev: any) => ({
                              ...prev,
                              elemekId: items.data
                                ? items.data.find((item) => item.name === e)?.id
                                : "",
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>
                  <div className="relative top-12">
                    <SubmitButton
                      onClick={handleConnectionUpdate}
                      title="Frissítés"
                    />
                  </div>
                </form>
              ) : currentlyEditedItem === "Partner" ? (
                <form className="w-full max-w-lg pt-6">
                  <div>
                    <FormField
                      label="Partner"
                      selected={editedPartner ? editedPartner.name : ""}
                      setSelected={(e) =>
                        setEditedPartner((prev: any) => ({ ...prev, name: e }))
                      }
                    />
                  </div>
                  <div className="relative top-12">
                    <SubmitButton onClick={handlePartnerUpdate} />
                  </div>
                </form>
              ) : currentlyEditedItem === "Típus" ? (
                <form className="w-full max-w-lg pt-6">
                  <div>
                    <FormField
                      label="Típus"
                      selected={editedType ? editedType.name : ""}
                      setSelected={(e) =>
                        setEditedType((prev: any) => ({ ...prev, name: e }))
                      }
                    />
                  </div>
                  <div className="relative top-12">
                    <SubmitButton
                      onClick={handleTypeUpdate}
                      title="Frissítés"
                    />
                  </div>
                </form>
              ) : (
                ""
              )}
            </Modal>

            <Group position="center">
              <div>
                <PencilIcon
                  className="float-left inline-block"
                  width={20}
                  height={20}
                />
              </div>
            </Group>
          </button>
        </div>
      </Dialog>
      <SideBar
        current={"Tételek"}
        elements={[
          { text: "Pénztárcák", link: "vallets" },
          { text: "Kategóriák", link: "categories" },
          { text: "Tételek", link: "items" },
        ]}
      />
      <Radio
        setItemState={(e) => {
          setItemType(e);
          window.sessionStorage.setItem("itemType", e);
        }}
        plans={["Bevételek", "Költségek"]}
        itemState={itemType ? itemType : ""}
      />
      <div className="absolute top-64 left-4 bottom-2 mx-auto mt-4 w-full max-w-md rounded-md bg-white py-8 px-3">
        <Tabs
          itemType={singularItemType.toLowerCase()}
          items={items}
          tabNames={tabs.map((t) => t)}
        />
      </div>
      <div
        className="absolute bottom-2 left-96 z-10 m-auto ml-24 flex rounded-md bg-white opacity-90"
        style={{ height: 815 / 2, width: "26.5%" }}
      >
        <DataGrid
          checkboxSelection={true}
          columns={connectionColumns}
          rows={connections.data ? connections.data : []}
          sx={{ fontWeight: 400 }}
          onSelectionModelChange={(ids) => {
            setConnectionSelectionModel(ids as string[]);
          }}
        />
      </div>
      <div
        className="absolute right-4 bottom-2 z-10 m-auto flex rounded-md bg-white opacity-90"
        style={{ height: 815 / 2, width: "23.25%" }}
      >
        <DataGrid
          checkboxSelection={true}
          columns={typeColumns}
          rows={types.data ? types.data : []}
          sx={{ fontWeight: 400 }}
          getRowId={(row) => row.id}
          onSelectionModelChange={(ids) => {
            setTypeSelectionModel(ids as string[]);
          }}
        />
      </div>
      <div
        className="absolute right-96 bottom-2 z-10 m-auto flex rounded-md bg-white opacity-90"
        style={{ height: 815 / 2, width: "23.25%", marginRight: 90 }}
      >
        <DataGrid
          checkboxSelection={true}
          columns={partnerColumns}
          rows={partners.data ? partners.data : []}
          getRowId={(row) => row.id}
          sx={{ fontWeight: 400 }}
          onSelectionModelChange={(ids) => {
            setPartnerSelectionModel(ids as string[]);
          }}
        />
      </div>
      <div
        className="absolute top-32 right-4 z-10 m-auto mb-2 flex rounded-md bg-white opacity-90"
        style={{ height: 815 / 2, width: "36.5%" }}
      >
        <DataGrid
          checkboxSelection={true}
          columns={itemColumns}
          getRowId={(row) => row.id}
          rows={items.data ? items.data : []}
          sx={{ fontWeight: 400 }}
          onSelectionModelChange={(ids) => {
            setItemSelectionModel(ids as string[]);
          }}
        />
      </div>
      <div
        className="relative z-10 m-auto flex rounded-md bg-white opacity-90"
        style={{ height: 815 / 2, width: "37%", right: 125, bottom: 115 }}
      >
        <DataGrid
          checkboxSelection={true}
          columns={categoryColumns}
          rows={categories.data ? categories.data : []}
          getRowId={(row) => row.id}
          sx={{ fontWeight: 400 }}
          onSelectionModelChange={(ids) => {
            setCategorySelectionModel(ids as string[]);
          }}
        />
      </div>
    </div>
  );
}
