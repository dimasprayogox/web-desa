<?php

namespace App\Filament\Resources;

use App\Filament\Resources\KategoriUmkmResource\Pages;
use App\Filament\Resources\KategoriUmkmResource\RelationManagers;
use App\Models\KategoriUmkm;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class KategoriUmkmResource extends Resource
{
    protected static ?string $model = KategoriUmkm::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';

    protected static ?string $navigationLabel = 'Kategori UMKM';

    protected static ?string $modelLabel = 'Kategori UMKM';

    protected static ?string $pluralModelLabel = 'Kategori UMKM';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationGroup = 'Manajemen UMKM';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Kategori')
                    ->schema([
                        Forms\Components\TextInput::make('nama_kategori')
                            ->label('Nama Kategori')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('Contoh: Kuliner, Perdagangan, Jasa')
                            ->helperText('Nama kategori yang akan digunakan untuk klasifikasi UMKM'),

                        Forms\Components\Textarea::make('deskripsi')
                            ->label('Deskripsi')
                            ->rows(3)
                            ->placeholder('Deskripsi singkat tentang kategori ini...')
                            ->helperText('Penjelasan tentang jenis usaha yang termasuk dalam kategori ini')
                            ->columnSpanFull(),

                        
                        
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nama_kategori')
                    ->label('Nama Kategori')
                    ->searchable()
                    ->sortable()
                    ->weight('medium'),

                Tables\Columns\TextColumn::make('deskripsi')
                    ->label('Deskripsi')
                    ->searchable()
                    ->sortable()
                    ->weight('medium'),
                    
                Tables\Columns\TextColumn::make('umkms_count')
                    ->label('Jumlah UMKM')
                    ->counts('umkms')
                    ->badge()
                    ->color('primary')
                    ->alignCenter(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Diperbarui')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('nama_kategori', 'asc')
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->before(function ($record, $action) {
                        if ($record->umkms()->count() > 0) {
                            \Filament\Notifications\Notification::make()
                                ->warning()
                                ->title('Tidak dapat menghapus!')
                                ->body('Kategori ini masih digunakan oleh ' . $record->umkms()->count() . ' UMKM. Pindahkan UMKM ke kategori lain terlebih dahulu.')
                                ->send();
                            $action->cancel();
                        }
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->before(function ($records, $action) {
                            $hasUmkms = $records->some(fn($record) => $record->umkms()->count() > 0);
                            if ($hasUmkms) {
                                \Filament\Notifications\Notification::make()
                                    ->warning()
                                    ->title('Tidak dapat menghapus!')
                                    ->body('Beberapa kategori masih digunakan oleh UMKM. Pindahkan UMKM ke kategori lain terlebih dahulu.')
                                    ->send();
                                $action->cancel();
                            }
                        }),
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
            'index' => Pages\ListKategoriUmkms::route('/'),
            'create' => Pages\CreateKategoriUmkm::route('/create'),
            'edit' => Pages\EditKategoriUmkm::route('/{record}/edit'),
        ];
    }
}
