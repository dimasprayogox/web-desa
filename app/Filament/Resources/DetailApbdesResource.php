<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DetailApbdesResource\Pages;
use App\Models\DetailApbdes;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class DetailApbdesResource extends Resource
{
    protected static ?string $model = DetailApbdes::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationLabel = 'Detail APBDes';
    protected static ?int $navigationSort = 3;
    protected static ?string $navigationGroup = 'APBDes';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Laporan')
                   
                    ->schema([
                        Forms\Components\Select::make('laporan_apbdes_id')
                            ->relationship('laporanApbdes', 'nama_laporan')
                            ->required()
                            ->searchable()
                            ->preload()
                            ->native(false)
                            ->label('Laporan APBDes')
                            ->placeholder('Pilih Laporan')
                            ->live()
                            ->afterStateUpdated(
                                fn($state, Forms\Set $set) =>
                                $set('tahun_info', \App\Models\LaporanApbdes::find($state)?->tahunData?->tahun ?? '-')
                            )
                            ->helperText('Pilih laporan APBDes yang akan didetailkan'),
                    ])
                    ->columns(1)
                    ->columnSpanFull(),

                Forms\Components\Section::make('Detail APBDes')
                     ->schema([
                        Forms\Components\Repeater::make('details')
                            ->schema([
                                Forms\Components\Select::make('tipe')
                                    ->options([
                                        'pendapatan' => 'Pendapatan',
                                        'belanja' => 'Belanja',
                                        'pembiayaan' => 'Pembiayaan',
                                    ])
                                    ->required()
                                    ->native(false)
                                    ->default('pendapatan')
                                    ->label('Jenis')
                                    ->placeholder('Pilih Jenis')
                                    ->columnSpan(1),

                                Forms\Components\TextInput::make('uraian')
                                    ->required()
                                    ->maxLength(255)
                                    ->label('Uraian')
                                    ->placeholder('Contoh: Hasil Usaha Desa')
                                    ->columnSpan(1),

                                Forms\Components\TextInput::make('anggaran')
                                    ->required()
                                    ->numeric()
                                    ->prefix('Rp')
                                    ->label('Anggaran')
                                    ->placeholder('0')
                                    ->default(0)
                                    ->columnSpan(1),

                                Forms\Components\TextInput::make('realisasi')
                                    ->required()
                                    ->numeric()
                                    ->prefix('Rp')
                                    ->label('Realisasi')
                                    ->placeholder('0')
                                    ->default(0)
                                    ->columnSpan(1),
                            ])
                            ->columns(2)
                            ->defaultItems(1)
                            ->addActionLabel('Tambah Detail')
                            ->reorderable(true)
                            ->collapsible()
                            ->itemLabel(fn(array $state): ?string => $state['uraian'] ?? 'Detail Baru')
                            ->deleteAction(
                                fn(Forms\Components\Actions\Action $action) => $action
                                    ->requiresConfirmation()
                            )
                            ->columnSpanFull(),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('laporanApbdes.nama_laporan')
                    ->searchable()
                    ->sortable()
                    ->label('Laporan APBDes')
                    ->wrap()
                    ->weight('medium'),

                Tables\Columns\TextColumn::make('laporanApbdes.tahunData.tahun')
                    ->sortable()
                    ->label('Tahun')
                    ->badge()
                    ->color('info'),

                Tables\Columns\TextColumn::make('tipe')
                    ->badge()
                    ->colors([
                        'success' => 'pendapatan',
                        'danger' => 'belanja',
                        'warning' => 'pembiayaan',
                    ])
                    ->formatStateUsing(fn($state) => ucfirst($state))
                    ->sortable()
                    ->label('Jenis'),

                Tables\Columns\TextColumn::make('uraian')
                    ->searchable()
                    ->wrap()
                    ->limit(50)
                    ->label('Uraian')
                    ->tooltip(fn($record) => $record->uraian),

                Tables\Columns\TextColumn::make('anggaran')
                    ->money('IDR')
                    ->sortable()
                    ->label('Anggaran')
                    ->alignEnd(),

                Tables\Columns\TextColumn::make('realisasi')
                    ->money('IDR')
                    ->sortable()
                    ->label('Realisasi')
                    ->alignEnd(),

                Tables\Columns\TextColumn::make('selisih')
                    ->getStateUsing(fn($record) => $record->realisasi - $record->anggaran)
                    ->money('IDR')
                    ->color(fn($state) => $state < 0 ? 'danger' : 'success')
                    ->label('Selisih')
                    ->alignEnd()
                    ->tooltip(fn($state) => $state < 0 ? 'Kurang dari anggaran' : 'Melebihi anggaran'),

                Tables\Columns\TextColumn::make('persentase')
                    ->getStateUsing(fn($record) => $record->anggaran > 0
                        ? round(($record->realisasi / $record->anggaran) * 100, 2)
                        : 0)
                    ->suffix('%')
                    ->color(fn($state) => match (true) {
                        $state < 50 => 'danger',
                        $state < 80 => 'warning',
                        $state < 100 => 'info',
                        default => 'success',
                    })
                    ->label('% Realisasi')
                    ->alignEnd(),

               
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('laporan_apbdes_id')
                    ->relationship('laporanApbdes', 'nama_laporan')
                    ->label('Filter Laporan')
                    ->searchable()
                    ->preload()
                    ->placeholder('Semua Laporan'),

                Tables\Filters\SelectFilter::make('tipe')
                    ->options([
                        'pendapatan' => 'Pendapatan',
                        'belanja' => 'Belanja',
                        'pembiayaan' => 'Pembiayaan',
                    ])
                    ->label('Filter Jenis')
                    ->placeholder('Semua Jenis'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->requiresConfirmation(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->requiresConfirmation(),
                ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->emptyStateHeading('Belum ada detail APBDes')
            ->emptyStateDescription('Klik tombol "Tambah Detail APBDes" untuk menambahkan detail baru.')
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
            'index' => Pages\ListDetailApbdes::route('/'),
            'create' => Pages\CreateDetailApbdes::route('/create'),
            'edit' => Pages\EditDetailApbdes::route('/{record}/edit'),
        ];
    }

    public static function getNavigationGroup(): ?string
    {
        return 'APBDes';
    }
}
