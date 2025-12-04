<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UmkmResource\Pages;
use App\Filament\Resources\UmkmResource\RelationManagers;
use App\Models\Umkm;
use App\Models\KategoriUmkm;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;
use Filament\Forms\Components\FileUpload;

class UmkmResource extends Resource
{
    protected static ?string $model = Umkm::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-storefront';

    protected static ?string $navigationLabel = 'UMKM';

    protected static ?string $modelLabel = 'UMKM';

    protected static ?string $pluralModelLabel = 'UMKM';

    protected static ?int $navigationSort = 1;

    protected static ?string $navigationGroup = 'Manajemen UMKM';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Dasar')
                    ->schema([
                        Forms\Components\Select::make('kategori_id')
                            ->label('Kategori')
                            ->options(KategoriUmkm::all()->pluck('nama_kategori', 'id'))
                            ->required()
                            ->searchable()
                            ->columnSpan(1),

                        Forms\Components\TextInput::make('nama')
                            ->label('Nama UMKM')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->columnSpan(1),

                        Forms\Components\Textarea::make('deskripsi')
                            ->label('Deskripsi')
                            ->rows(3)
                            ->columnSpanFull(), // <-- ini bikin dia 1 baris full di bawah
                    ])
                    ->columns(3),


                Forms\Components\Section::make('Alamat & Kontak')
                    ->schema([
                        Forms\Components\TextInput::make('telepon')
                            ->label('No. Telepon')
                            ->tel()
                            ->maxLength(50),
                        Forms\Components\Textarea::make('alamat')
                            ->label('Alamat Lengkap')
                            ->maxLength(500)
                            ->rows(2)
                            ->columnSpanFull(),

                    ])
                    ->columns(3),


                Forms\Components\Section::make('Media')
                    ->schema([
                        FileUpload::make('foto_galeri')
                            ->label('Foto Galeri')
                            ->image()                        // hanya terima gambar
                            ->multiple()                     // izinkan multiple upload
                            ->maxFiles(6)                    // batasi jumlah file (ubah sesuai kebutuhan)
                            ->maxSize(5120)                  // max 5MB per file (KB)
                            ->directory('umkm_galleries')    // folder penyimpanan di disk public
                            ->disk('public')                 // pakai disk 'public' (local storage)
                            ->preserveFilenames(false)       // biarkan Laravel memberi nama unik
                            ->visibility('public')           // visibility public agar bisa diakses via storage link
                            ->helperText('Upload beberapa foto galeri. Ukuran maksimal 5MB per file.')
                            ->columnSpanFull(),
                    ]),

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('kategori.nama_kategori')
                    ->label('Kategori')
                    ->badge()
                    ->sortable(),
                Tables\Columns\TextColumn::make('nama')
                    ->label('Nama UMKM')
                    ->searchable()
                    ->sortable()
                    ->weight('medium'),
                Tables\Columns\ImageColumn::make('foto_galeri')
                    ->label('Galeri')
                    ->stacked() // ✅ Tampilkan multiple images bertumpuk
                    ->limit(3) // Maksimal tampilkan 3
                    ->limitedRemainingText() // Tampilkan "+2 more"
                    ->circular()
                    ->size(50)
                    ->getStateUsing(function ($record) {
                        // ✅ Ambil raw value, skip accessor
                        $value = $record->getAttributes()['foto_galeri'];

                        if (empty($value)) {
                            return [];
                        }

                        // Decode JSON jadi array
                        if (is_string($value)) {
                            $value = json_decode($value, true);
                        }

                        if (!is_array($value)) {
                            return [];
                        }

                        // ✅ Return array URL absolut
                        return array_map(function ($path) {
                            return url('storage/' . $path);
                        }, $value);
                    }),


                Tables\Columns\TextColumn::make('telepon')
                    ->label('Telepon')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Terdaftar')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('kategori_id')
                    ->label('Kategori')
                    ->relationship('kategori', 'nama_kategori'),
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
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUmkms::route('/'),
            'create' => Pages\CreateUmkm::route('/create'),
            'edit' => Pages\EditUmkm::route('/{record}/edit'),
        ];
    }
}
