<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TahunDataResource\Pages;
use App\Models\TahunData;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class TahunDataResource extends Resource
{
    protected static ?string $model = TahunData::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';
    protected static ?string $navigationLabel = 'Tahun Data';
    protected static ?string $modelLabel = 'Tahun Data';
    protected static ?string $pluralModelLabel = 'Data Tahun';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Tahun Data')
                    ->description('Masukkan informasi tahun data untuk statistik desa')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('tahun')
                                    ->label('Tahun')
                                    ->required()
                                    ->numeric()
                                    ->minValue(2000)
                                    ->maxValue((int) date('Y') + 5)
                                    ->default((int) date('Y'))
                                    ->helperText('Tahun data yang akan digunakan untuk statistik (2000 - ' . ((int) date('Y') + 5) . ')')
                                    ->unique(ignoreRecord: true)
                                    ->validationMessages([
                                        'required' => 'Tahun wajib diisi.',
                                        'numeric' => 'Tahun harus berupa angka.',
                                        'min' => 'Tahun minimal adalah 2000.',
                                        'max' => 'Tahun maksimal adalah ' . ((int) date('Y') + 5) . '.',
                                        'unique' => 'Tahun ini sudah ada, gunakan tahun yang berbeda.',
                                    ]),

                                // TOGGLE ACTIVE/INACTIVE
                                Forms\Components\Toggle::make('is_active')
                                    ->label('Status Aktif')
                                    ->default(true)
                                    ->inline(false)
                                    ->helperText('Aktifkan untuk menggunakan tahun ini dalam input data'),
                            ]),

                        Forms\Components\Textarea::make('keterangan')
                            ->label('Keterangan')
                            ->rows(4)
                            ->maxLength(1000)
                            ->placeholder('Masukkan keterangan atau catatan khusus untuk tahun data ini...')
                            ->helperText('Keterangan tambahan untuk tahun data (opsional, maksimal 1000 karakter)')
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Preview Data Terkait')
                    ->description('Informasi jumlah data yang terkait dengan tahun ini')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\Placeholder::make('demografi_count')
                                    ->label('Data Demografi Dusun')
                                    ->content(function ($record) {
                                        if (!$record) return '0 dusun';
                                        return $record->demografiDusun()->count() . ' dusun';
                                    }),

                                Forms\Components\Placeholder::make('apbdes_count')
                                    ->label('Laporan APBDes')
                                    ->content(function ($record) {
                                        if (!$record) return '0 laporan';
                                        return $record->laporanApbdes()->count() . ' laporan';
                                    }),
                            ]),
                    ])
                    ->visibleOn('edit'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('tahun')
                    ->label('Tahun')
                    ->sortable()
                    ->searchable()
                    ->weight('bold')
                    ->size('lg')
                    ->badge()
                    ->color('primary'),

                // KOLOM STATUS dengan BADGE (Lebih Jelas)
                Tables\Columns\TextColumn::make('is_active')
                    ->label('Status')
                    ->formatStateUsing(fn(bool $state): string => $state ? 'AKTIF' : 'NONAKTIF')
                    ->badge()
                    ->color(fn(bool $state): string => $state ? 'success' : 'danger')
                    ->icon(fn(bool $state): string => $state ? 'heroicon-o-check-circle' : 'heroicon-o-x-circle')
                    ->sortable()
                    ->alignCenter()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('keterangan')
                    ->label('Keterangan')
                    ->limit(50)
                    ->tooltip(function (Tables\Columns\TextColumn $column): ?string {
                        $state = $column->getState();
                        if (strlen($state) <= 50) {
                            return null;
                        }
                        return $state;
                    })
                    ->wrap()
                    ->searchable(),

                Tables\Columns\TextColumn::make('demografi_count')
                    ->label('Data Dusun')
                    ->getStateUsing(function ($record): string {
                        $count = $record->demografiDusun()->count();
                        return $count . ' dusun';
                    })
                    ->badge()
                    ->color(fn(string $state): string => (int) explode(' ', $state)[0] > 0 ? 'success' : 'gray')
                    ->alignCenter(),

                Tables\Columns\TextColumn::make('detail_count')
                    ->label('Detail Demografi')
                    ->getStateUsing(function ($record): string {
                        $total = $record->demografiDusun()
                            ->withCount('demografiDetails')
                            ->get()
                            ->sum('demografi_details_count');
                        return $total . ' record';
                    })
                    ->badge()
                    ->color(fn(string $state): string => (int) explode(' ', $state)[0] > 0 ? 'info' : 'gray')
                    ->alignCenter(),

                Tables\Columns\TextColumn::make('apbdes_count')
                    ->label('Laporan APBDes')
                    ->getStateUsing(function ($record): string {
                        $count = $record->laporanApbdes()->count();
                        return $count . ' laporan';
                    })
                    ->badge()
                    ->color(fn(string $state): string => (int) explode(' ', $state)[0] > 0 ? 'warning' : 'gray')
                    ->alignCenter(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Diperbarui')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                // FILTER ACTIVE/INACTIVE
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Status')
                    ->placeholder('Semua Status')
                    ->trueLabel('Hanya Aktif')
                    ->falseLabel('Hanya Nonaktif')
                    ->queries(
                        true: fn(Builder $query) => $query->where('is_active', true),
                        false: fn(Builder $query) => $query->where('is_active', false),
                    ),

                Tables\Filters\Filter::make('tahun_range')
                    ->form([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('tahun_dari')
                                    ->label('Tahun Dari')
                                    ->numeric()
                                    ->placeholder('2000'),
                                Forms\Components\TextInput::make('tahun_sampai')
                                    ->label('Tahun Sampai')
                                    ->numeric()
                                    ->placeholder((string) date('Y')),
                            ]),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['tahun_dari'],
                                fn(Builder $query, $value): Builder => $query->where('tahun', '>=', $value),
                            )
                            ->when(
                                $data['tahun_sampai'],
                                fn(Builder $query, $value): Builder => $query->where('tahun', '<=', $value),
                            );
                    }),

                Tables\Filters\Filter::make('has_demografi')
                    ->label('Memiliki Data Demografi')
                    ->query(fn(Builder $query): Builder => $query->whereHas('demografiDusun')),

                Tables\Filters\Filter::make('has_apbdes')
                    ->label('Memiliki Laporan APBDes')
                    ->query(fn(Builder $query): Builder => $query->whereHas('laporanApbdes')),
            ])
            ->actions([
                // TOMBOL AKTIFKAN/NONAKTIFKAN (Dinamis)
                Tables\Actions\Action::make('toggle_status')
                    ->label(fn($record) => $record->is_active ? 'Nonaktifkan' : 'Aktifkan')
                    ->icon(fn($record) => $record->is_active ? 'heroicon-o-x-circle' : 'heroicon-o-check-circle')
                    ->color(fn($record) => $record->is_active ? 'danger' : 'success')
                    ->action(function ($record) {
                        $newStatus = ! $record->is_active;

                        // Update record yang dipilih
                        $record->update(['is_active' => $newStatus]);

                        // Jika diaktifkan, matikan semua record lain agar hanya 1 active
                        if ($newStatus) {
                            \App\Models\TahunData::where($record->getKeyName(), '!=', $record->getKey())
                                ->update(['is_active' => false]);
                        }

                        \Filament\Notifications\Notification::make()
                            ->title($newStatus ? 'Tahun Diaktifkan' : 'Tahun Dinonaktifkan')
                            ->success()
                            ->body("Tahun {$record->tahun} berhasil " . ($newStatus ? 'diaktifkan' : 'dinonaktifkan'))
                            ->send();
                    })
                    ->requiresConfirmation()
                    ->modalHeading(fn($record) => $record->is_active ? 'Nonaktifkan Tahun?' : 'Aktifkan Tahun?')
                    ->modalDescription(
                        fn($record) =>
                        $record->is_active
                            ? "Tahun {$record->tahun} akan dinonaktifkan dan tidak bisa dipilih saat input data baru."
                            : "Tahun {$record->tahun} akan diaktifkan dan bisa dipilih saat input data baru."
                    )
                    ->modalSubmitActionLabel(fn($record) => $record->is_active ? 'Nonaktifkan' : 'Aktifkan'),

                Tables\Actions\ViewAction::make()
                    ->label('Lihat'),

                Tables\Actions\EditAction::make()
                    ->label('Edit'),

                Tables\Actions\DeleteAction::make()
                    ->label('Hapus')
                    ->modalHeading('Hapus Tahun Data?')
                    ->modalDescription('Data tahun dan semua data terkait akan dihapus permanen.')
                    ->successNotificationTitle('Tahun data berhasil dihapus'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    // BULK ACTIVATE -> akan aktifkan hanya 1 (pertama) dan matikan yang lain
                    Tables\Actions\BulkAction::make('activate')
                        ->label('Aktifkan Tahun Terpilih')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->action(function ($records) {
                            // Jika tidak ada record, nothing to do
                            if ($records->isEmpty()) {
                                return;
                            }

                            // Ambil record pertama yang dipilih — kita aktifkan hanya itu
                            $first = $records->first();

                            // Aktifkan record pertama
                            \App\Models\TahunData::where($first->getKeyName(), $first->getKey())
                                ->update(['is_active' => true]);

                            // Matikan semua record lain
                            \App\Models\TahunData::where($first->getKeyName(), '!=', $first->getKey())
                                ->update(['is_active' => false]);

                            $count = $records->count();
                            \Filament\Notifications\Notification::make()
                                ->title('Tahun Diaktifkan')
                                ->success()
                                ->body("Dari {$count} yang dipilih, Tahun {$first->tahun} diaktifkan. Semua tahun lain dinonaktifkan.")
                                ->send();
                        })
                        ->deselectRecordsAfterCompletion()
                        ->requiresConfirmation()
                        ->modalHeading('Aktifkan Tahun Terpilih?')
                        ->modalDescription('Mengaktifkan satu tahun (yang pertama dipilih) dan menonaktifkan tahun lainnya. Jika Anda memilih >1, hanya yang pertama yang akan diaktifkan.')
                        ->modalSubmitActionLabel('Aktifkan'),

                    // BULK DEACTIVATE
                    Tables\Actions\BulkAction::make('deactivate')
                        ->label('Nonaktifkan Tahun Terpilih')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->action(function ($records) {
                            $count = $records->count();
                            $records->each->update(['is_active' => false]);

                            \Filament\Notifications\Notification::make()
                                ->title('Tahun Dinonaktifkan')
                                ->success()
                                ->body("{$count} tahun berhasil dinonaktifkan")
                                ->send();
                        })
                        ->deselectRecordsAfterCompletion()
                        ->requiresConfirmation()
                        ->modalHeading('Nonaktifkan Tahun Terpilih?')
                        ->modalDescription('Semua tahun yang dipilih akan dinonaktifkan dan tidak bisa digunakan untuk input data baru.')
                        ->modalSubmitActionLabel('Nonaktifkan'),

                    Tables\Actions\DeleteBulkAction::make()
                        ->label('Hapus Terpilih'),
                ]),
            ])
            ->emptyStateHeading('Belum ada data tahun')
            ->emptyStateDescription('Klik tombol "Tambah Tahun Data" untuk membuat data tahun baru.')
            ->emptyStateIcon('heroicon-o-calendar-days')
            ->emptyStateActions([
                Tables\Actions\CreateAction::make()
                    ->label('Tambah Tahun Data')
                    ->icon('heroicon-o-plus'),
            ])
            ->defaultSort('tahun', 'desc')
            ->striped()
            ->paginated([10, 25, 50, 100]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTahunData::route('/'),
            'create' => Pages\CreateTahunData::route('/create'),
            'edit' => Pages\EditTahunData::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadgeColor(): ?string
    {
        $activeCount = static::getModel()::where('is_active', true)->count();
        return $activeCount > 0 ? 'success' : 'danger';
    }

    public static function getNavigationGroup(): ?string
    {
        return 'Data Tahun';
    }

    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
    {
        if ($record->demografiDusun()->exists() || $record->laporanApbdes()->exists()) {
            return false;
        }
        return true;
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['tahun', 'keterangan'];
    }

    public static function getGlobalSearchResultDetails(\Illuminate\Database\Eloquent\Model $record): array
    {
        $demografiCount = $record->demografiDusun()->count();
        $apbdesCount = $record->laporanApbdes()->count();
        $status = $record->is_active ? 'Aktif' : 'Nonaktif';

        return [
            'Status' => $status,
            'Keterangan' => $record->keterangan ?? '-',
            'Data Terkait' => "{$demografiCount} demografi dusun, {$apbdesCount} laporan APBDes"
        ];
    }
}
