<?php

// UBAH namespace ini
namespace App\Filament\Resources;

use App\Filament\Resources\LaporanApbdes\Pages;
use App\Models\LaporanApbdes;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class LaporanApbdesResource extends Resource
{
    protected static ?string $model = LaporanApbdes::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $recordTitleAttribute = 'nama_laporan';

    protected static ?string $navigationLabel = 'Laporan APBDes';

    protected static ?string $navigationGroup = 'APBDes';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Laporan')
                    ->description('Masukkan informasi dasar laporan APBDes')
                    ->schema([
                        Forms\Components\Select::make('tahun_id')
                            ->relationship('tahunData', 'tahun')
                            ->required()
                            ->searchable()
                            ->preload()
                            ->native(false)
                            ->label('Tahun')
                            ->placeholder('Pilih Tahun')
                            ->helperText('Pilih tahun untuk laporan APBDes'),

                        Forms\Components\TextInput::make('nama_laporan')
                            ->required()
                            ->maxLength(255)
                            ->label('Nama Laporan')
                            ->placeholder('Contoh: APBDES 2024')
                            ->helperText('Nama laporan yang akan ditampilkan'),

                        Forms\Components\Select::make('bulan_rilis')
                            ->required()
                            ->options([
                                1 => 'Januari',
                                2 => 'Februari',
                                3 => 'Maret',
                                4 => 'April',
                                5 => 'Mei',
                                6 => 'Juni',
                                7 => 'Juli',
                                8 => 'Agustus',
                                9 => 'September',
                                10 => 'Oktober',
                                11 => 'November',
                                12 => 'Desember',
                            ])
                            ->native(false)
                            ->searchable()
                            ->label('Bulan Rilis')
                            ->placeholder('Pilih Bulan')
                            ->helperText('Bulan terbitnya laporan'),

                        Forms\Components\Textarea::make('deskripsi')
                            ->maxLength(65535)
                            ->rows(4)
                            ->columnSpanFull()
                            ->label('Deskripsi')
                            ->placeholder('Deskripsi laporan (opsional)')
                            ->helperText('Keterangan tambahan tentang laporan ini'),
                    ])
                    ->columns(2)
                    ->columnSpanFull(),

                Forms\Components\Section::make('Preview Detail')
                    ->description('Jumlah detail yang sudah ditambahkan')
                    ->schema([
                        Forms\Components\Placeholder::make('detail_count')
                            ->label('Jumlah Detail APBDes')
                            ->content(function ($record) {
                                if (!$record) return '0 detail';
                                return $record->detailApbdes()->count() . ' detail';
                            }),
                    ])
                    ->visibleOn('edit')
                    ->columnSpanFull(),
            ]);
    }

    // TAMBAHKAN getEloquentQuery untuk load relasi
    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withCount('detailApbdes'); // Load count relasi
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('tahunData.tahun')
                    ->sortable()
                    ->searchable()
                    ->label('Tahun')
                    ->badge()
                    ->color('info'),

                Tables\Columns\TextColumn::make('nama_laporan')
                    ->searchable()
                    ->label('Nama Laporan')
                    ->weight('medium')
                    ->wrap()
                    ->limit(50),

                Tables\Columns\TextColumn::make('bulan_rilis')
                    ->formatStateUsing(fn($state) => [
                        1 => 'Januari',
                        2 => 'Februari',
                        3 => 'Maret',
                        4 => 'April',
                        5 => 'Mei',
                        6 => 'Juni',
                        7 => 'Juli',
                        8 => 'Agustus',
                        9 => 'September',
                        10 => 'Oktober',
                        11 => 'November',
                        12 => 'Desember',
                    ][$state] ?? '-')
                    ->sortable()
                    ->label('Bulan Rilis')
                    ->icon('heroicon-m-calendar'),

                // CARA 1: Menggunakan withCount di query (RECOMMENDED)
                Tables\Columns\TextColumn::make('detail_apbdes_count')
                    ->label('Jumlah Detail')
                    ->badge()
                    ->color(fn($state) => $state > 0 ? 'success' : 'gray')
                    ->formatStateUsing(fn($state) => $state . ' detail')
                    ->sortable(),

                // CARA 2: Hitung manual (jika withCount tidak jalan)
                // Tables\Columns\TextColumn::make('jumlah_detail')
                //     ->label('Jumlah Detail')
                //     ->getStateUsing(fn($record) => $record->detailApbdes()->count())
                //     ->badge()
                //     ->color(fn($state) => $state > 0 ? 'success' : 'gray')
                //     ->formatStateUsing(fn($state) => $state . ' detail'),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->label('Dibuat')
                    ->toggleable(isToggledHiddenByDefault: true),

                
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('tahun_id')
                    ->relationship('tahunData', 'tahun')
                    ->label('Filter Tahun')
                    ->placeholder('Semua Tahun'),

                Tables\Filters\SelectFilter::make('bulan_rilis')
                    ->options([
                        1 => 'Januari',
                        2 => 'Februari',
                        3 => 'Maret',
                        4 => 'April',
                        5 => 'Mei',
                        6 => 'Juni',
                        7 => 'Juli',
                        8 => 'Agustus',
                        9 => 'September',
                        10 => 'Oktober',
                        11 => 'November',
                        12 => 'Desember',
                    ])
                    ->label('Filter Bulan')
                    ->placeholder('Semua Bulan'),

                Tables\Filters\Filter::make('has_details')
                    ->label('Memiliki Detail')
                    ->query(fn(Builder $query) => $query->has('detailApbdes')),

                Tables\Filters\Filter::make('no_details')
                    ->label('Belum Ada Detail')
                    ->query(fn(Builder $query) => $query->doesntHave('detailApbdes')),
            ])
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->label('Lihat'),
                Tables\Actions\EditAction::make()
                    ->label('Edit'),
                Tables\Actions\DeleteAction::make()
                    ->label('Hapus')
                    ->requiresConfirmation(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->requiresConfirmation(),
                ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->emptyStateHeading('Belum ada laporan APBDes')
            ->emptyStateDescription('Mulai dengan menambahkan laporan APBDes baru.')
            ->emptyStateIcon('heroicon-o-document-text')
            ->striped();
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLaporanApbdes::route('/'),
            'create' => Pages\CreateLaporanApbdes::route('/create'),
            'edit' => Pages\EditLaporanApbdes::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function getNavigationGroup(): ?string
    {
        return 'APBDes';
    }
}
