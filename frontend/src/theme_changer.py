import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replacements for backgrounds
    content = content.replace('bg-[#111]', 'bg-slate-50')
    content = content.replace('bg-[#1A1A1A]', 'bg-white')
    content = content.replace('bg-white/[0.02]', 'bg-white')
    content = content.replace('bg-white/[0.03]', 'bg-slate-50')
    content = content.replace('bg-white/[0.05]', 'bg-slate-100')
    content = content.replace('bg-white/5', 'bg-slate-100')
    content = content.replace('bg-white/10', 'bg-slate-200')
    
    # Borders
    content = content.replace('border-white/[0.05]', 'border-slate-200')
    content = content.replace('border-white/10', 'border-slate-200')
    content = content.replace('border-white/5', 'border-slate-200')
    content = content.replace('border-white/20', 'border-slate-300')
    
    # Text colors
    content = content.replace('text-zinc-500', 'text-slate-500')
    content = content.replace('text-zinc-400', 'text-slate-600')
    content = content.replace('text-zinc-300', 'text-slate-700')
    content = content.replace('text-zinc-200', 'text-slate-800')
    content = content.replace('placeholder-zinc-600', 'placeholder-slate-400')
    content = content.replace('placeholder-zinc-500', 'placeholder-slate-400')
    
    # Replace text-white carefully (don't replace if it's in a primary button or label)
    # Using regex to replace text-white only if it's not preceded by bg-something colored
    # We will replace all text-white, and then fix the buttons
    content = content.replace('text-white', 'text-slate-900')
    
    # Fix buttons and colored badges
    content = content.replace('bg-primary-600 hover:bg-primary-500 text-slate-900', 'bg-primary-600 hover:bg-primary-500 text-white')
    content = content.replace('bg-primary-600 text-slate-900', 'bg-primary-600 text-white')
    content = content.replace('bg-blue-600 text-slate-900', 'bg-blue-600 text-white')
    content = content.replace('bg-red-500 text-slate-900', 'bg-red-500 text-white')
    content = content.replace('bg-red-600 text-slate-900', 'bg-red-600 text-white')
    content = content.replace('text-slate-900 rounded-md text-sm', 'text-white rounded-md text-sm') # Auth button edge case
    
    # Hover states
    content = content.replace('hover:bg-white/5', 'hover:bg-slate-100')
    content = content.replace('hover:bg-white/10', 'hover:bg-slate-200')
    content = content.replace('hover:text-white', 'hover:text-slate-900')
    content = content.replace('hover:text-zinc-200', 'hover:text-slate-700')
    
    # Shadows and other dark mode specifics
    content = content.replace('shadow-[0_0_10px_rgba(239,68,68,0.5)]', 'shadow-md shadow-red-500/20')
    
    # Primary light tweaks
    content = content.replace('text-primary-100', 'text-primary-900')
    content = content.replace('text-primary-200', 'text-primary-800')
    content = content.replace('text-primary-400', 'text-primary-600')
    content = content.replace('bg-primary-900/30', 'bg-primary-50')
    
    with open(filepath, 'w') as f:
        f.write(content)

for root, dirs, files in os.walk('/home/dodo/Dogfood-Hackathon/frontend/src'):
    for file in files:
        if file.endswith('.jsx'):
            process_file(os.path.join(root, file))
