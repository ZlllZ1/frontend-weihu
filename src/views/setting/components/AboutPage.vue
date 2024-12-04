<template>
  <div class="py-8">
    <p>{{ $t('message.aboutContent.title') }}</p>
    <p>{{ $t('message.aboutContent.welcome') }}</p>

    <p class="mt-6">{{ $t('message.aboutContent.vision.title') }}</p>
    <p>{{ $t('message.aboutContent.vision.content') }}</p>

    <p class="mt-6">{{ $t('message.aboutContent.mission.title') }}</p>
    <p>{{ $t('message.aboutContent.mission.items[0]') }}</p>
    <p>{{ $t('message.aboutContent.mission.items[1]') }}</p>
    <p>{{ $t('message.aboutContent.mission.items[2]') }}</p>

    <p class="mt-6">{{ $t('message.aboutContent.features.title') }}</p>
    <p>{{ $t('message.aboutContent.features.items[0]') }}</p>
    <p>{{ $t('message.aboutContent.features.items[1]') }}</p>
    <p>{{ $t('message.aboutContent.features.items[2]') }}</p>
    <p>{{ $t('message.aboutContent.features.items[3]') }}</p>

    <p class="mt-6">{{ $t('message.aboutContent.privacy.title') }}</p>
    <p>
      {{ $t('message.aboutContent.privacy.content')
      }}<a
        href="/privacyGuidelines"
        target="_blank"
        class="hover:text-blue font-semibold"
        >{{ $t('message.privacy') }}</a
      >
      <a
        href="/protocol"
        target="_blank"
        class="hover:text-blue font-semibold"
        >{{ $t('message.protocol') }}</a
      >
    </p>

    <p class="mt-6">{{ $t('message.aboutContent.closing') }}</p>
  </div>
</template>
