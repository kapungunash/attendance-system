<script lang="ts">
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    TableSearch,
  } from "flowbite-svelte";
  import { writable } from "svelte/store";
  let searchTerm = "";
  let items = [
    { id: 1, maker: "De", type: "ABC", make: "absent" },
    { id: 2, maker: "De", type: "CDE", make: "absent" },
    { id: 3, maker: "De", type: "FGH", make: "absent" },
    { id: 4, maker: "de", type: "absent", make: "absent" },
  ];
  $: filteredItems = items.filter(
    (item) => item.maker.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
  );

  const sortKey = writable("id"); // default sort key
  const sortDirection = writable(1); // default sort direction (ascending)
  const sortItems = writable(items.slice()); // make a copy of the items array

  // Define a function to sort the items
  const sortTable = (key) => {
    // If the same key is clicked, reverse the sort direction
    if ($sortKey === key) {
      sortDirection.update((val) => -val);
    } else {
      sortKey.set(key);
      sortDirection.set(1);
    }
  };

  $: {
    const key = $sortKey;
    const direction = $sortDirection;
    const sorted = [...$sortItems].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal) {
        return -direction;
      } else if (aVal > bVal) {
        return direction;
      }
      return 0;
    });
    sortItems.set(sorted);
  }
</script>

<main class="p-4 w-full">
  <Table
    striped
    divClass="border w-full rounded-lg overflow-hidden border-gray-300"
  >
    <TableHead class="bg-gray-200 border border-b border-gray-300">
      <TableHeadCell on:click={() => sortTable("id")}>Employee ID</TableHeadCell
      >
      <TableHeadCell on:click={() => sortTable("id")}>Name</TableHeadCell>
      <TableHeadCell on:click={() => sortTable("id")}>Department</TableHeadCell>
      <TableHeadCell on:click={() => sortTable("id")}>Status</TableHeadCell>
      <TableHeadCell on:click={() => sortTable("id")}></TableHeadCell>
    </TableHead>
    <TableBody class="divide-y">
      {#each filteredItems as item}
        <TableBodyRow>
          <TableBodyCell>{item.id}</TableBodyCell>
          <TableBodyCell>{item.maker}</TableBodyCell>
          <TableBodyCell>{item.type}</TableBodyCell>
          <TableBodyCell>{item.make}</TableBodyCell>

          <TableBodyCell>
            <a class="a" href="/">Profile</a>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</main>
