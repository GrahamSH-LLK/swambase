<template>
  <UContainer>
    <h2 class="text-2xl font-extrabold">Upload a Meet Database</h2>
    <p>
      Upload a .mdb file from <code>`C:\TM5Data`</code> to import a meet into
      the database
    </p>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormField>

      <UFormField label="MDB File" name="file">
        <UInput type="file" accept=".mdb" ref="file" />
      </UFormField>

      <UButton type="submit"> Submit </UButton>
    </UForm>
  </UContainer>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

const schema = z.object({
  password: z.string().min(8, "Must be at least 8 characters"),
});
type Schema = z.output<typeof schema>;
const state = reactive<Partial<Schema>>({
  password: undefined,
});
const toast = useToast();
const fileEl = useTemplateRef("file");
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const data = new FormData();
  data.append("password", event.data.password);
  const file = fileEl.value?.inputRef?.files?.[0];
  if (file) {
    data.append("file", file);
  } else {
    toast.add({
      title: "Error",
      description: "No file selected",
      color: "error",
    });
    return;
  }
  const res = await $fetch("/api/import", {
    method: "POST",
    body: data,
  }).catch((e) => {
    console.log("hii", e);
    toast.add({
      title: "Error",
      description: e.data.message,
      color: "error",
    });
  });
  if (res?.success) {
    toast.add({
      title: "Success",
      description: "The form has been submitted.",
      color: "success",
    });
  }
}
</script>
