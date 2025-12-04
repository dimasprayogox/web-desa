@props([
    'image' => asset('images/logo-placeholder.jpg'),
    'url' => '#'
])

<div class="rounded-2xl overflow-hidden p-8 flex flex-col items-center text-center">
    {{-- Gambar berbentuk lingkaran --}}
    <div class="w-60 h-60 rounded-full overflow-hidden border-4 border-white shadow-md">
        <img src="{{ $image }}" alt="" class="object-cover w-full h-full">
    </div>
</div>
