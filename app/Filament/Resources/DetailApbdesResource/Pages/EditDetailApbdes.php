<?php

namespace App\Filament\Resources\DetailApbdesResource\Pages;

use App\Filament\Resources\DetailApbdesResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDetailApbdes extends EditRecord
{
    protected static string $resource = DetailApbdesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make()
                ->after(fn () => $this->redirect($this->getRedirectUrl())),
        ];
    }

    // populate repeater 'details' from relation when mounting the edit page
    public function mount($record): void
    {
        parent::mount($record);

        if ($this->record && ! $this->record->relationLoaded('details')) {
            $this->record->load('details');
        }

        $details = $this->record->details->map(fn($d) => $d->toArray())->toArray();
        $this->form->fill(['details' => $details]);
    }

    // capture details before save and remove from main payload
    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (isset($data['details']) && is_array($data['details'])) {
            unset($data['details']);
        }

        return $data;
    }

    // synchronize details after saving the parent record
    protected function afterSave(): void
    {
        if (! isset($this->details) || ! is_array($this->details)) {
            return;
        }

        // Simple sync: delete old and recreate. Adjust if you need update/patch logic.
        $this->record->details()->delete();

        foreach ($this->details as $detail) {
            if (is_array($detail) && count(array_filter($detail, fn($v) => $v !== null && $v !== '')) > 0) {
                $this->record->details()->create($detail);
            }
        }
    }

    protected function getRedirectUrl(): string
    {
        $indexPath = $this->getResource()::getUrl('index');

        if (strpos($indexPath, '://') !== false) {
            $indexPath = parse_url($indexPath, PHP_URL_PATH) ?: '/';
        }

        if (! str_starts_with($indexPath, '/')) {
            $indexPath = '/' . ltrim($indexPath, '/');
        }

        if (! str_starts_with($indexPath, '/admin')) {
            $indexPath = '/admin' . $indexPath;
        }

        return url($indexPath);
    }

    protected function getSavedNotificationTitle(): ?string
    {
        return 'Detail APBDes berhasil diperbarui!';
    }
}
