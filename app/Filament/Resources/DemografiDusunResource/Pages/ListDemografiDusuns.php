<?php
// filepath: app/Filament/Resources/DemografiDusunResource/Pages/ListDemografiDusuns.php

namespace App\Filament\Resources\DemografiDusunResource\Pages;

use App\Filament\Resources\DemografiDusunResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListDemografiDusuns extends ListRecords
{
    protected static string $resource = DemografiDusunResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->label('Tambah Data Dusun')
                ->icon('heroicon-o-plus'),
        ];
    }

    public function getTabs(): array
    {
        return [
            'semua' => Tab::make('Semua Data'),

            'tahun_ini' => Tab::make('Tahun Ini')
                ->modifyQueryUsing(
                    fn(Builder $query) =>
                    $query->whereHas(
                        'tahunData',
                        fn($q) =>
                        $q->where('tahun', now()->year)
                    )
                )
                ->badge(fn() => \App\Models\DemografiDusun::whereHas(
                    'tahunData',
                    fn($q) =>
                    $q->where('tahun', now()->year)
                )->count()),
        ];
    }
}
