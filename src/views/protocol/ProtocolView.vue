<template>
  <main>
    <div class="bg-white rounded-lg p-4 leading-8">
      <h1 class="text-2xl font-bold mb-6 flex items-center justify-center">
        {{ $t('message.protocolContent.title') }}
      </h1>
      <!-- eslint-disable-next-line -->
      <div v-html="$t('message.protocolContent.content')"></div>
    </div>
  </main>
</template>
