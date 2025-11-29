<?php
// filepath: app/Filament/Resources/DemografiDusunResource.php

namespace App\Filament\Resources;

use App\Filament\Resources\DemografiDusunResource\Pages;
use App\Models\DemografiDusun;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class DemografiDusunResource extends Resource
{
    protected static ?string $model = DemografiDusun::class;

    protected static ?string $navigationIcon = 'heroicon-o-map';

    protected static ?string $navigationLabel = 'Data Dusun';

    protected static ?string $modelLabel = 'Data Dusun';

    protected static ?string $pluralModelLabel = 'Data Dusun';

    protected static ?string $navigationGroup = 'Data Kependudukan';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Tahun & Dusun')
                    ->description('Pilih tahun data dan nama dusun')
                    ->schema([
                        // Grid utama: 3 kolom
                        Forms\Components\Grid::make()
                            ->columns(2)
                            ->schema([
                                // Kolom 1: Tahun (select dengan create form terpisah)
                                Forms\Components\Select::make('tahun_id')
                                    ->label('Tahun Data')
                                    ->relationship('tahunData', 'tahun')
                                    ->required()
                                    ->searchable()
                                    ->preload()
                                    ->createOptionForm([
                                        Forms\Components\TextInput::make('tahun')
                                            ->label('Tahun')
                                            ->required()
                                            ->numeric()
                                            ->minValue(2000)
                                            ->maxValue((int) date('Y') + 5)
                                            ->unique(),
                                        // GANTI nama field agar tidak konflik dengan keterangan utama
                                        Forms\Components\Textarea::make('tahun_keterangan')
                                            ->label('Keterangan Tahun')
                                            ->maxLength(1000),
                                    ])
                                    ->live()
                                    ->helperText('Pilih tahun untuk data dusun'),

                                // Kolom 2: Nama Dusun
                                Forms\Components\TextInput::make('nama_dusun')
                                    ->label('Nama Dusun')
                                    ->required()
                                    ->maxLength(100)
                                    ->placeholder('')
                                    ->unique(ignoreRecord: true, modifyRuleUsing: function ($rule, $get) {
                                        return $rule->where('tahun_id', $get('tahun_id'));
                                    })
                                    ->validationMessages([
                                        'unique' => 'Nama dusun untuk tahun ini sudah ada.',
                                    ]),


                                // Keterangan keseluruhan untuk Dusun (beri nama yang berbeda)
                                Forms\Components\Textarea::make('keterangan')
                                    ->label('Keterangan Dusun')
                                    ->rows(3)
                                    ->maxLength(500)
                                    ->placeholder('Catatan tambahan tentang dusun ini...')
                                    ->columnSpanFull(),
                            ])
                            ->columns(2),
                    ])
            ]);
    }


    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('tahunData.tahun')
                    ->label('Tahun')
                    ->sortable()
                    ->searchable()
                    ->badge()
                    ->color('primary'),

                Tables\Columns\TextColumn::make('nama_dusun')
                    ->label('Nama Dusun')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('keterangan')
                    ->label('Keterangan Dusun')
                    ->limit(50),
                    
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('tahun_id')
                    ->label('Tahun')
                    ->relationship('tahunData', 'tahun')
                    ->searchable()
                    ->preload(),

                Tables\Filters\SelectFilter::make('nama_dusun')
                    ->label('Dusun')
                    ->options(fn() => \App\Models\DemografiDusun::pluck('nama_dusun', 'nama_dusun')->unique())
                    ->searchable(),
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
            ->defaultSort('tahunData.tahun', 'desc')
            ->emptyStateHeading('Belum ada data dusun')
            ->emptyStateDescription('Klik tombol "Tambah Data Dusun" untuk memulai.')
            ->emptyStateIcon('heroicon-o-map');
    }

    public static function getRelations(): array
    {
        return [
            // Kosongkan, tidak pakai relation manager
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDemografiDusuns::route('/'),
            'create' => Pages\CreateDemografiDusun::route('/create'),
            'edit' => Pages\EditDemografiDusun::route('/{record}/edit'),
            'view' => Pages\ViewDemografiDusun::route('/{record}'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }
}
