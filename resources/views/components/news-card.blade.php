@props([
    'image' => asset('images/logo-placeholder.jpg'), //
    'title' => 'Judul Berita Default',
    'summary' => 'Ringkasan singkat...',
    'url' => '#'
])

<div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col w-60 h-72">
    
    <img src="{{ $image }}" alt="{{ $title }}" class="w-full h-32 object-cover">
    
    <div class="p-3 text-left flex flex-col flex-grow">
        <h3 class="font-semibold text-gray-800 dark:text-white text-sm line-clamp-2">{{ $title }}</h3>
        <p class="text-xs text-gray-600 dark:text-gray-400 mt-2 flex-grow line-clamp-3">
            {{ $summary }}
        </p>
        
        <a href="{{ $url }}" class="text-indigo-600 text-xs mt-3 inline-block hover:underline">
            Baca selengkapnya →
        </a>
    </div>
</div>