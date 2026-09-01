import os

def count_prod_loc(root_dir):
    total_loc = 0
    file_count = 0
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Exclude tests and generated directories
        dirnames[:] = [d for d in dirnames if d.lower() not in ['tests', 'test', 'generated', 'node_modules', '.git', 'scratch', 'dist', 'build']]
        
        for f in filenames:
            if f.lower().endswith(('.js', '.jsx', '.ts', '.tsx')):
                if 'generated' in f.lower() or 'test' in f.lower():
                    continue
                filepath = os.path.join(dirpath, f)
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as file:
                    lines = file.readlines()
                    # Count non-empty non-comment lines
                    loc = sum(1 for line in lines if line.strip() and not line.strip().startswith('//') and not line.strip().startswith('/*') and not line.strip().startswith('*'))
                    total_loc += loc
                    file_count += 1
                    print(f"{filepath}: {loc} loc")
                    
    print(f"\nTOTAL PROD LOC: {total_loc} across {file_count} files")
    return total_loc

if __name__ == '__main__':
    count_prod_loc('src')
