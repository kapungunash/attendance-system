<script lang="ts">
  import {
    Alert,
    Badge,
    Button,
    Modal,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import { Trash2, AlertCircle, Info, QrCodeIcon } from "lucide-svelte";
  import type { PageData } from "./$types";
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import AddEmployeeModal from "../../_components/add-employee-modal/add-employee-modal.svelte";

  import { onMount } from "svelte";
  //@ts-ignore
  import QRCode from "qrcode";
  import type { any } from "zod";

  $: canv = undefined as any;
  let qrCode: QRCode;

  onMount(async () => {
    qrCode = await QRCode.toCanvas(canv, "Sample text");
  });

  export let data: PageData;
  let deleteform: HTMLFormElement;
  let isNewEmployeeModalOpen: boolean = false;
  let confirmDeletion: boolean = false;

  $: qrUrl = "";
  $: console.log(qrUrl);

  let showEmployeeQr: boolean = false;

  $: toast = {
    type: "success",
    show: false,
    message: "",
  };

  let { employees } = data;
  let toDelete: string = "";
  let toShowQR: string = "";

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
      employees = employees.filter(({ userId }) => userId !== toDelete);

      showToast("success", "Department deleted successfully");
    };
  };
</script>

<main class="p-4 w-full">
  <header class="mb-6 flex flex-col">
    <div class="flex justify-between items-center w-full">
      <h1 class="font-semibold text-xl">Employees</h1>
      <Button on:click={() => (isNewEmployeeModalOpen = true)}
        >Add employee</Button
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
      <TableHeadCell>Email</TableHeadCell>
      <TableHeadCell>Department</TableHeadCell>
      <TableHeadCell>Status</TableHeadCell>
      <TableHeadCell></TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
      {#each employees as f}
        <TableBodyRow>
          <TableBodyCell>{f.userId}</TableBodyCell>
          <TableBodyCell>{f.user.fullname}</TableBodyCell>
          <TableBodyCell>{f.user.email}</TableBodyCell>
          <TableBodyCell>{f.department?.name}</TableBodyCell>
          <TableBodyCell>
            <Badge color="yellow">
              {f.status}
            </Badge>
          </TableBodyCell>

          <TableBodyCell class="flex gap-2">
            <form
              bind:this={deleteform}
              use:enhance={deleteDepartment}
              method="POST"
              action={"employees/delete?empl-id=" + f.userId}
            >
              <Button
                on:click={() => {
                  toDelete = f.userId;
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
            <Button
              on:click={() => {
                toShowQR = f.userId;

                QRCode.toDataURL(
                  f.userId,
                  { errorCorrectionLevel: "H" },
                  function (err, url) {
                    if (err) throw err;
                    toShowQR = f.userId;
                    qrUrl = url;
                    showEmployeeQr = true;
                  }
                );
              }}
              outline={false}
              class="!p-2"
              type="button"
              size="lg"
            >
              <QrCodeIcon class="w-5 h-5 text-white" />
            </Button>
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
      Are you sure you want to delete this employee?
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

<AddEmployeeModal
  departments={data.departments.map((d) => ({ name: d.name, value: d.id }))}
  bind:open={isNewEmployeeModalOpen}
/>

<Modal
  bind:open={showEmployeeQr}
  class="overflow-hidden h-full flex items-center justify-center"
>
  <img src={qrUrl} class="h-64 bg-red-200 w-64" />
  <div class="flex items-center justify-center text-center">
    {toShowQR}
  </div>
</Modal>
