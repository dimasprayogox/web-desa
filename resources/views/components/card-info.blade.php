@props([
    'title' => 'Judul Default',
    'summary' => 'Deskripsi singkat',
    'image' => asset('images/logo-placeholder.jpg'),
])

<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition duration-300 w-full h-full min-h-[280px] md:min-h-[320px]">
    <!-- Foto dengan tinggi tetap -->
    <div class="h-[180px] md:h-[220px] bg-gray-100 overflow-hidden flex-shrink-0">
        <img src="{{ $image }}" alt="{{ $title }}" class="w-full h-full object-cover">
    </div>
    
    <!-- Content area dengan tinggi tetap -->
    <div class="p-3 md:p-4 flex flex-col justify-center text-center bg-gradient-to-b from-slate-50 to-white flex-grow h-[100px] md:h-[100px]">
        <h3 class="text-sm md:text-lg font-bold text-gray-800 dark:text-white mb-1 leading-tight line-clamp-2">{{ $title }}</h3>
        <p class="text-xs md:text-sm font-medium text-indigo-600 dark:text-indigo-400 leading-tight line-clamp-2">
            {{ $summary }}
        </p>
    </div>
</div>
