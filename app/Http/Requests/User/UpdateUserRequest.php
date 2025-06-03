<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255',  Rule::unique(User::class)->ignore(
                $this->route('user') instanceof User ? $this->route('user')->id : $this->route('user')
            ),],
            'password' => ['nullable', Password::defaults()],
            'roleIds' => ['required', 'array'],
            'roleIds.*' => ['integer', 'exists:roles,id'],
            'permissionIds' => ['nullable', 'array'],
            'permissionIds.*' => ['integer', 'exists:permissions,id']
        ];
    }
}
