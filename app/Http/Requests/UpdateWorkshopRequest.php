<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkshopRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('Manager');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'unique:workshops,code,' . $this->route('workshop')->id],
            'title' => ['required', 'string', 'max:255'],
            'instructor' => ['required', 'string', 'max:255'],
            'starts_at' => ['required', 'date'],
            'capacity' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'string', 'in:scheduled,completed,cancelled'],
        ];
    }
}
