<script lang="ts">
  import {
    Alert,
    Button,
    Modal,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    TableSearch,
  } from "flowbite-svelte";
  import { Trash2, AlertCircle, Info } from "lucide-svelte";
  import { writable } from "svelte/store";
  import AddDepartmentModal from "../../_components/add-department-modal/add-department-modal.svelte";
  import type { PageData } from "./$types";
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";

  export let data: PageData;
  let deleteform: HTMLFormElement;
  let isNewDepartmentModalOpen: boolean = false;
  let confirmDeletion: boolean = false;

  $: toast = {
    type: "success",
    show: false,
    message: "",
  };

  let { departments } = data;
  let toDelete: string = "";

  const showToast = (type: "success" | "error", message: string) => {
    toast = {
      type,
      message,
      show: true,
    };

    setTimeout(() => {
      toast = {
        type: "success",
        show: false,
        message: "",
      };
    }, 5000);
  };

  const deleteDepartment: SubmitFunction = () => {
    return ({ result }) => {
      //@ts-ignore
      if (result.status > 300) {
        //@ts-ignore
        showToast("error", result?.data?.message);
        return;
      }
      departments = departments.filter(({ id }) => id !== toDelete);

      showToast("success", "Department deleted successfully");
    };
  };
</script>

<main class="p-4 w-full">
  <header class="mb-6 flex flex-col">
    <div class="flex justify-between items-center w-full">
      <h1 class="font-semibold text-xl">Departments</h1>
      <Button on:click={() => (isNewDepartmentModalOpen = true)}
        >Add department</Button
      >
    </div>
  </header>
  <Table
    striped
    divClass="border w-full rounded-lg overflow-hidden border-gray-300"
  >
    <TableHead class="bg-gray-200 border border-b border-gray-300">
      <TableHeadCell>ID</TableHeadCell>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Check-in time</TableHeadCell>
      <TableHeadCell>Check-out time</TableHeadCell>
      <TableHeadCell>Employees</TableHeadCell>
      <TableHeadCell></TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
      {#each departments as f}
        <TableBodyRow>
          <TableBodyCell>{f.id}</TableBodyCell>
          <TableBodyCell>{f.name}</TableBodyCell>
          <TableBodyCell>{f.checkInTime}</TableBodyCell>
          <TableBodyCell>{f.checkOutTime}</TableBodyCell>
          <TableBodyCell>0</TableBodyCell>

          <TableBodyCell>
            <form
              bind:this={deleteform}
              use:enhance={deleteDepartment}
              method="POST"
              action={"departments/delete?dept-id=" + f.id}
            >
              <Button
                on:click={() => {
                  toDelete = f.id;
                  confirmDeletion = true;
                }}
                outline={false}
                class="!p-2"
                type="button"
                color="red"
                size="lg"
              >
                <Trash2 class="w-5 h-5 text-white" />
              </Button>
            </form>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</main>

<Modal bind:open={confirmDeletion} size="xs" autoclose>
  <div class="text-center">
    <AlertCircle
      class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
    />
    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
      Are you sure you want to delete this department?
    </h3>
    <Button
      on:click={() => {
        deleteform.requestSubmit();
      }}
      color="red"
      class="me-2">Yes, I'm sure</Button
    >
    <Button
      on:click={() => {
        toDelete = "";
        confirmDeletion = false;
      }}
      color="alternative">No, cancel</Button
    >
  </div>
</Modal>

{#if toast.show}
  <Alert
    class="absolute bottom-10 right-10 shadow-md"
    color={toast.type === "success" ? "green" : "red"}
    dismissable
  >
    <Info slot="icon" class="w-4 h-4" />
    {toast.message}
  </Alert>
{/if}

<AddDepartmentModal bind:open={isNewDepartmentModalOpen} />
