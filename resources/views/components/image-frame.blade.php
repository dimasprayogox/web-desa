@props([
    'image' => asset('images/logo-placeholder.jpg'),
])

<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition duration-300 w-full h-full">
    <img src="{{ $image }}" class="w-full h-48 object-cover">
</div>
