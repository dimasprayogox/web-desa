@props(['value', 'label'])

<div class="bg-gray-800 dark:bg-gray-800 text-center rounded-2xl py-8 px-6 shadow flex flex-col justify-center items-center min-h-[140px]">
  <h2 class="text-4xl font-extrabold text-blue-400 mb-3 leading-none">
    {{ number_format($value ?? 0, 0, ',', '.') }}
  </h2>
  <p class="text-sm font-semibold uppercase tracking-wide text-gray-300">
    {{ $label }}
  </p>
</div>
