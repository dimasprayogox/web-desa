<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DemografiDetailResource\Pages;
use App\Models\DemografiDetail;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Grid;

class DemografiDetailResource extends Resource
{
    protected static ?string $model = DemografiDetail::class;

    protected static ?string $slug = 'demografi-detail';

    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';
    protected static ?string $navigationGroup = 'Data Kependudukan';
    protected static ?int $navigationSort = 2;
    protected static ?string $modelLabel = 'Detail Demografi';
    protected static ?string $pluralModelLabel = 'Detail Demografi';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Pilih Tahun & Dusun')
                    ->description('Pilih tahun terlebih dahulu, kemudian pilih dusun yang akan diisi datanya.')
                    ->schema([
                        Forms\Components\Select::make('tahun_filter')
                            ->label('Pilih Tahun')
                            ->options(\App\Models\TahunData::active()->orderBy('tahun', 'desc')->pluck('tahun', 'id_tahun')) // Hanya tampilkan yang aktif
                            ->live()
                            ->preload()
                            ->afterStateUpdated(fn(Set $set) => $set('demografi_dusun_id', null))
                            ->helperText('Pilih tahun untuk memfilter dusun (hanya tahun aktif).')
                            ->required(fn(string $context) => $context === 'create'),

                        Forms\Components\Select::make('demografi_dusun_id')
                            ->label('Pilih Dusun')
                            ->options(function (Get $get, $record) {
                                $tahunId = $get('tahun_filter');

                                if ($record) {
                                    return \App\Models\DemografiDusun::query()
                                        ->whereHas('tahunData')
                                        ->get()
                                        ->mapWithKeys(fn($dusun) => [
                                            $dusun->id_dusun => "{$dusun->nama_dusun} ({$dusun->tahunData->tahun})"
                                        ])
                                        ->toArray();
                                }

                                if (!$tahunId) {
                                    return [];
                                }

                                return \App\Models\DemografiDusun::query()
                                    ->where('tahun_id', $tahunId)
                                    ->pluck('nama_dusun', 'id_dusun');
                            })
                            ->disabled(fn(Get $get, $record) => !$get('tahun_filter') && !$record)
                            ->searchable()
                            ->preload(),
                    ])
                    ->columns(2)
                    ->columnSpanFull(),

                Forms\Components\Tabs::make('Data Demografi')
                    ->columnSpanFull()
                    ->tabs([
                        // TAB 1: DATA WILAYAH
                        Forms\Components\Tabs\Tab::make('📊 Data Wilayah')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('rt')
                                        ->label('Jumlah RT')
                                        ->numeric()
                                        ->default(0),
                                    TextInput::make('kk')
                                        ->label('Jumlah KK')
                                        ->numeric()
                                        ->default(0),
                                ]),
                            ]),

                        // TAB 2: USIA
                        Forms\Components\Tabs\Tab::make('👶 Usia')
                            ->schema([
                                Grid::make(3)->schema([
                                    Placeholder::make('label_balita')->content('👶 Balita (0-5 th)'),
                                    TextInput::make('usia_0_5_l')->label('Laki-laki')->numeric()->default(0),
                                    TextInput::make('usia_0_5_p')->label('Perempuan')->numeric()->default(0),

                                    Placeholder::make('label_anak')->content('🧒 Anak (6-12 th)'),
                                    TextInput::make('usia_6_12_l')->label('Laki-laki')->numeric()->default(0),
                                    TextInput::make('usia_6_12_p')->label('Perempuan')->numeric()->default(0),

                                    Placeholder::make('label_remaja')->content('👦 Remaja (13-17 th)'),
                                    TextInput::make('usia_13_17_l')->label('Laki-laki')->numeric()->default(0),
                                    TextInput::make('usia_13_17_p')->label('Perempuan')->numeric()->default(0),

                                    Placeholder::make('label_dewasa')->content('👨 Dewasa (18-40 th)'),
                                    TextInput::make('usia_18_40_l')->label('Laki-laki')->numeric()->default(0),
                                    TextInput::make('usia_18_40_p')->label('Perempuan')->numeric()->default(0),

                                    Placeholder::make('label_tua')->content('👴 Tua (41+ th)'),
                                    TextInput::make('usia_41_plus_l')->label('Laki-laki')->numeric()->default(0),
                                    TextInput::make('usia_41_plus_p')->label('Perempuan')->numeric()->default(0),
                                ]),
                            ]),

                        // TAB 3: AGAMA
                        Forms\Components\Tabs\Tab::make('🕌 Agama')
                            ->schema([
                                Grid::make(2)->schema([
                                    Placeholder::make('label_islam')->content('🕌 Islam'),
                                    TextInput::make('islam')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_kristen')->content('✝️ Kristen'),
                                    TextInput::make('kristen')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_katolik')->content('✝️ Katolik'),
                                    TextInput::make('katolik')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_hindu')->content('🕉️ Hindu'),
                                    TextInput::make('hindu')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_buddha')->content('☸️ Buddha'),
                                    TextInput::make('buddha')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_konghucu')->content('☯️ Konghucu'),
                                    TextInput::make('konghucu')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_agama_lainnya')->content('🌟 Lainnya'),
                                    TextInput::make('agama_lainnya')->label('Jumlah')->numeric()->default(0),
                                ]),
                            ]),

                        // TAB 4: PEKERJAAN
                        Forms\Components\Tabs\Tab::make('💼 Pekerjaan')
                            ->schema([
                                Grid::make(2)->schema([
                                    Placeholder::make('label_belum_bekerja')->content('🚫 Belum/Tidak Bekerja'),
                                    TextInput::make('belum_bekerja')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_pelajar')->content('🎓 Pelajar/Mahasiswa'),
                                    TextInput::make('pelajar_mahasiswa')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_petani')->content('🌾 Petani'),
                                    TextInput::make('petani')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_buruh_tani')->content('👨‍🌾 Buruh Tani'),
                                    TextInput::make('buruh_tani')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_wiraswasta')->content('💼 Wiraswasta'),
                                    TextInput::make('wiraswasta')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_pns')->content('🎖️ PNS/TNI/Polri'),
                                    TextInput::make('pns_tni_polri')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_karyawan')->content('👔 Karyawan'),
                                    TextInput::make('karyawan')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_irt')->content('👩‍🍳 Ibu Rumah Tangga'),
                                    TextInput::make('ibu_rumah_tangga')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_pekerjaan_lainnya')->content('🔧 Lainnya'),
                                    TextInput::make('pekerjaan_lainnya')->label('Jumlah')->numeric()->default(0),
                                ]),
                            ]),

                        // TAB 5: PENDIDIKAN
                        Forms\Components\Tabs\Tab::make('🎓 Pendidikan')
                            ->schema([
                                Grid::make(2)->schema([
                                    Placeholder::make('label_belum_sekolah')->content('👶 Belum Sekolah'),
                                    TextInput::make('belum_sekolah')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_tidak_tamat_sd')->content('📚 Tidak Tamat SD'),
                                    TextInput::make('tidak_tamat_sd')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_sd')->content('🏫 SD/Sederajat'),
                                    TextInput::make('sd_sederajat')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_smp')->content('🏫 SMP/Sederajat'),
                                    TextInput::make('smp_sederajat')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_sma')->content('🏫 SMA/Sederajat'),
                                    TextInput::make('sma_sederajat')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_diploma')->content('🎓 Diploma'),
                                    TextInput::make('diploma')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_s1')->content('🎓 Sarjana (S1)'),
                                    TextInput::make('sarjana')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_s2')->content('🎓 Magister (S2)'),
                                    TextInput::make('s2')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_s3')->content('🎓 Doktor (S3)'),
                                    TextInput::make('s3')->label('Jumlah')->numeric()->default(0),
                                ]),
                            ]),

                        // TAB 6: PERKAWINAN
                        Forms\Components\Tabs\Tab::make('💑 Perkawinan')
                            ->schema([
                                Grid::make(2)->schema([
                                    Placeholder::make('label_belum_kawin')->content('👤 Belum Kawin'),
                                    TextInput::make('belum_kawin')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_kawin')->content('💑 Kawin'),
                                    TextInput::make('kawin')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_cerai_hidup')->content('💔 Cerai Hidup'),
                                    TextInput::make('cerai_hidup')->label('Jumlah')->numeric()->default(0),

                                    Placeholder::make('label_cerai_mati')->content('🕊️ Cerai Mati'),
                                    TextInput::make('cerai_mati')->label('Jumlah')->numeric()->default(0),
                                ]),
                            ]),
                    ]),
            ]);
    }

    // HAPUS getEloquentQuery() atau simplified
    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->with(['demografiDusun.tahunData']); // Hanya with, tanpa select manual
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('demografiDusun.tahunData.tahun')
                    ->label('Tahun')
                    ->sortable()
                    ->searchable()
                    ->badge()
                    ->color('primary'),

                Tables\Columns\TextColumn::make('demografiDusun.nama_dusun')
                    ->label('Dusun')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('rt')
                    ->label('RT')
                    ->state(fn($record) => $record->wilayah['rt'] ?? 0)
                    ->numeric()
                    ->alignCenter()
                    ->sortable(),

                Tables\Columns\TextColumn::make('kk')
                    ->label('KK')
                    ->state(fn($record) => $record->wilayah['kk'] ?? 0)
                    ->numeric()
                    ->alignCenter()
                    ->sortable()
                    ->color('info'),

                // TOTAL PENDUDUK menggunakan accessor
                Tables\Columns\TextColumn::make('total_penduduk')
                    ->label('Total Penduduk')
                    ->numeric()
                    ->weight('bold')
                    ->alignCenter()
                    ->color('success'),

                // TOTAL LAKI-LAKI menggunakan accessor
                Tables\Columns\TextColumn::make('total_laki')
                    ->label('Laki-laki')
                    ->numeric()
                    ->alignCenter()
                    ->color('info')
                    ->toggleable(),

                // TOTAL PEREMPUAN menggunakan accessor
                Tables\Columns\TextColumn::make('total_perempuan')
                    ->label('Perempuan')
                    ->numeric()
                    ->alignCenter()
                    ->color('warning')
                    ->toggleable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('tahun')
                    ->label('Tahun')
                    ->options(fn() => \App\Models\TahunData::orderBy('tahun', 'desc')->pluck('tahun', 'id_tahun'))
                    ->query(function (Builder $query, array $data) {
                        if (!empty($data['value'])) {
                            $query->whereHas('demografiDusun', function ($q) use ($data) {
                                $q->where('tahun_id', $data['value']);
                            });
                        }
                    }),

                Tables\Filters\SelectFilter::make('demografi_dusun_id')
                    ->label('Dusun')
                    ->relationship('demografiDusun', 'nama_dusun'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDemografiDetails::route('/'),
            'create' => Pages\CreateDemografiDetail::route('/create'),
            'edit' => Pages\EditDemografiDetail::route('/{record}/edit'),
            'view' => Pages\ViewDemografiDetail::route('/{record}'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }
}
